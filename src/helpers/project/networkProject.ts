// project.ts

import { nextTick } from "vue";
import { AxiosResponse } from "axios";

import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { TNetwork, TSimulation, TSimulationCode } from "@/types";
import { closeLoading, openLoading, useAppStore } from "@/stores/appStore";

import { BaseProject, IBaseProjectProps } from "./project";
import { INetworkProps, BaseNetwork } from "../network/network";
import { NetworkRevision } from "../network/networkRevision";
import { NodeActivities } from "../nodeActivity/nodeActivities";
import { BaseSimulation, ISimulationProps } from "../simulation/simulation";
import { SimulationCode } from "../simulation/simulationCode";

export interface INetworkProjectProps extends IBaseProjectProps {
  network?: INetworkProps;
  simulation?: ISimulationProps;
}

// export class NetworkProject<TNode extends BaseNode<BaseModel>> extends BaseProject {
export class NetworkProject extends BaseProject {
  private _networkRevision: NetworkRevision; // network history
  public _network: BaseNetwork; // network of neurons and devices
  public _simulation: TSimulation; // settings for the simulation

  constructor(projectProps: INetworkProjectProps = {}) {
    super(projectProps);
    // this.logger.settings.minLevel = 1;

    // Initialize model database.
    this.initModelStore();

    // Construct components.
    this._network = new this.Network(this, projectProps.network);
    this._networkRevision = new NetworkRevision(this);

    this._simulation = new this.Simulation(this, projectProps.simulation);
  }

  override get Activities() {
    return NodeActivities;
  }

  override get Code() {
    return SimulationCode;
  }

  get Network() {
    return BaseNetwork;
  }

  get Simulation() {
    return BaseSimulation;
  }

  override get activities(): NodeActivities {
    return this._activities as NodeActivities;
  }

  override get code(): TSimulationCode {
    return this._code as TSimulationCode;
  }

  get baseNetwork(): BaseNetwork {
    return this._network;
  }

  get baseSimulation(): BaseSimulation {
    return this._simulation;
  }

  get network(): TNetwork {
    return this._network;
  }

  /**
   * Get network revision.
   */
  get networkRevision(): NetworkRevision {
    return this._networkRevision;
  }

  get simulation(): TSimulation {
    return this._simulation;
  }

  /**
   * Checkout network.
   */
  checkoutNetwork(): void {
    this.logger.trace("checkout network");

    const networkProps = this._networkRevision.load();
    this.network.update(networkProps);
    this.network.clean();

    // Generate simulation code.
    this.initCode();

    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;
    if (projectViewStore.state.simulationEvents.onCheckout) {
      // Run simulation.
      nextTick(() => this.startSimulation());
    } else {
      // Update activities in activity graph.
      this._activityGraph.activityChartGraph.updateActivities();

      // Update activity graph.
      this._activityGraph.update();
    }
  }

  /**
   * Initialize project.
   */
  override init(): void {
    this.logger.trace("init");

    // Initialize code.
    this.code.init();

    // TODO: initializing others might be obsolete
    nextTick(() => {
      // Initialize network.
      // this.network.init();

      // Initialize network history.
      // this.networkRevision.init();

      // Initialize simulation.
      // this.simulation.init();

      // Initialize activities.
      // this.activities.init();

      // Initialize activity graph.
      this.activityGraph.init();

      this.updateHash();
      this.doc.hash = this.hash;

      this.clean();
    });
  }

  /**
   * Observer for network project changes.
   *
   * @remarks
   * It updates hash of the network.
   * It generates codes in the code editor.
   * It commits the network in the network history.
   */
  override onUpdate(props: { cleanPanels?: boolean; preventSimulation?: boolean; resetPanels?: boolean } = {}): void {
    this.updateHash();

    this.state.checkChanges();

    this.logger.trace("on update");

    this.activities.checkRecorders();

    this.networkRevision.commit();

    if (props.cleanPanels) this._activityGraph.activityChartGraph.cleanPanels();
    if (props.resetPanels) this._activityGraph.activityChartGraph.resetPanels();
    if (props.preventSimulation) return;

    this.startSimulationOnChange();
  }

  /**
   * Start simulation.
   */
  startSimulation(): void {
    this.logger.trace("start simulation");

    this._network.clean();

    // Reset activities and activity graphs.
    this.activities.reset();

    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;
    if (!projectViewStore.state.simulationEvents.onChange) openLoading("Simulating... Please wait");

    const simtoc = Date.now();
    this._simulation
      .start()
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        this.state.state.stopwatch.simulation = Date.now() - simtoc;

        if (response == null || response.status !== 200 || response.data == null || !response.data.data) return;

        if (response.data.data.plotly) {
          const plotly_json = response.data.data.plotly;
          const vistoc = Date.now();
          this.activityGraph.activityChartGraph.react(plotly_json.data, plotly_json.layout);
          this.state.state.stopwatch.visualization = Date.now() - vistoc;
        } else {
          const vistoc = Date.now();
          // Update activities.
          this.activities.update(response.data.data);
          this.state.state.stopwatch.visualization = Date.now() - vistoc;
        }

        // Commit network for the history (with activity).
        this.networkRevision.commit(true);
      })
      .finally(() => {
        closeLoading();
      });
  }

  /**
   * Simulate when the configuration is set.
   */
  startSimulationOnChange(): void {
    this.logger.trace("start simulation on change");

    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;
    if (projectViewStore.state.simulationEvents.onChange) nextTick(() => this.startSimulation());
  }

  // /**
  //  * Serialize for JSON.
  //  * @return project props
  //  */
  // override toJSON(): INetworkProjectProps {
  //   const projectProps: INetworkProjectProps = {
  //     activityGraph: this.activityGraph.toJSON(),
  //     code: this.code.toJSON(),
  //     createdAt: this.createdAt,
  //     description: this.description,
  //     id: this.id,
  //     name: this.name,
  //     // network: this.network.toJSON(),
  //     // simulation: this.simulation.toJSON(),
  //     updatedAt: this.updatedAt,
  //     version: process.env.APP_VERSION as string,
  //   };

  //   return projectProps;
  // }

  /**
   * Update hash.
   */
  override updateHash(): void {
    this._updateHash({
      description: this.description,
      id: this.id,
      name: this.name,
      network: this._network.hash,
      simulation: this._simulation.hash,
    });
  }
}
