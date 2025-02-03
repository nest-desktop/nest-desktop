// project.ts

import { nextTick } from "vue";
import { AxiosResponse } from "axios";

import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { TNetwork, TProject, TSimulation, TSimulationCode } from "@/types";
import { closeLoading, openLoading, useAppStore } from "@/stores/appStore";

import { Activity } from "../activity/activity";
import { BaseProject, IBaseProjectProps } from "./project";
import { INetworkProps, BaseNetwork } from "../network/network";
import { NetworkRevision } from "../network/networkRevision";
import { NodeActivities } from "../nodeActivity/nodeActivities";
import { upgradeProject } from "../upgrades/upgrades";
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

    // Initialize model database.
    this.initModelStore();

    // Upgrade project props.
    projectProps = upgradeProject(projectProps);

    // Construct components.
    this._network = new this.Network(this, projectProps.network);
    this._networkRevision = new NetworkRevision(this);

    this._simulation = new this.Simulation(this, projectProps.simulation);

    // Initialize components.
    nextTick(() => this.init());
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
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates codes in the code editor.
   * It commits the network in the network history.
   */
  override changes(props: { resetPanels?: boolean; preventSimulation?: boolean } = {}): void {
    this.updateHash();

    this.state.checkChanges();

    this.logger.trace("changes");

    this.activities.checkRecorders();

    this.generateCode();

    this.networkRevision.commit();

    // It resets panels of activity chart graph.
    if (props.resetPanels) this._activityGraph.activityChartGraph.resetPanels();

    if (!props.preventSimulation) this.startSimulationOnChange();
  }

  /**
   * Checkout network.
   */
  checkoutNetwork(): void {
    this.logger.trace("checkout network");

    const network = this._networkRevision.load();
    this.network.update(network);
    this.network.clean();

    // Generate simulation code.
    this.generateCode();

    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;
    if (projectViewStore.state.simulationEvents.onCheckout) {
      // Run simulation.
      nextTick(() => this.startSimulation());
    } else {
      // Update activities.
      this.activities.update(this.activities.all.map((activity: Activity) => activity.toJSON()));

      // Update activities in activity graph.
      this._activityGraph.activityChartGraph.updateActivities();

      // Update activity graph.
      this._activityGraph.update();
    }
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  override clone(): TProject {
    this.logger.trace("clone");

    return new NetworkProject({ ...this.toJSON(), id: "", updatedAt: "" });
  }

  /**
   * Initialize project.
   */
  override init(): void {
    this.logger.trace("init");

    // Initialize network.
    this.network.init();

    // Initialize network history.
    this.networkRevision.init();

    // Initialize simulation.
    this.simulation.init();

    // Generate code.
    this.generateCode();

    // Initialize activities.
    this.activities.init();

    // Initialize activity graph.
    this.activityGraph.init();

    this.updateHash();
    this.doc.hash = this.hash;

    this.clean();
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

        const vistoc = Date.now();
        // Update activities.
        this.activities.update(response.data.data);
        this.state.state.stopwatch.visualization = Date.now() - vistoc;

        // Commit network for the history.
        this.networkRevision.commit();
      })
      .finally(() => {
        closeLoading();
      });
  }

  /**
   * Simulate when the configuration is set.
   */
  startSimulationOnChange(): void {
    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace.views.project;
    if (projectViewStore.state.simulationEvents.onChange) nextTick(() => this.startSimulation());
  }

  /**
   * Serialize for JSON.
   * @return project props
   */
  override toJSON(): INetworkProjectProps {
    const projectProps: INetworkProjectProps = {
      activityGraph: this._activityGraph.toJSON(),
      createdAt: this.createdAt,
      description: this.description,
      id: this.id,
      name: this.name,
      network: this._network.toJSON(),
      simulation: this._simulation.toJSON(),
      updatedAt: this.updatedAt,
      version: process.env.APP_VERSION as string,
    };
    return projectProps;
  }

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
