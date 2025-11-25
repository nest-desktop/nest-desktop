// project.ts

import { nextTick } from "vue";
import type { AxiosResponse } from "axios";

import type { IAxiosResponseData } from "@/stores/defineBackendStore";
import type { Class, TNetwork, TSimulation } from "@/types";
import { closeLoading, openLoading, useAppStore } from "@/stores/appStore";

import { BaseProject, type IProjectState } from "./project";
import { BaseSimulation, type ISimulationState } from "../simulation";
import { NodeActivities } from "../nodeActivity";

import { type INetworkState, BaseNetwork } from "../../networkGraph/helpers/network/network";
import { NetworkRevision } from "../../networkGraph/helpers/network/networkRevision";
import { IBaseState } from "../common";
import { Activities } from "../activity";

export interface INetworkProjectState extends IProjectState {
  network?: INetworkState;
  simulation?: ISimulationState;
}

// export class NetworkProject<TNode extends BaseNode<AbstractModel>> extends AbstractProject{
export abstract class NetworkProject<T extends INetworkProjectState = INetworkProjectState> extends BaseProject<T> {
  private _networkRevision: NetworkRevision; // network history
  public _network: BaseNetwork; // network of neurons and devices
  public _simulation: TSimulation; // settings for the simulation

  constructor() {
    super();

    // Initialize model database.
    this.initModelStore();

    // Construct components.
    this._network = new this.Network(this);
    this._networkRevision = new NetworkRevision(this);

    this._simulation = new this.Simulation(this);
  }

  override get Activities(): Class<Activities> {
    return NodeActivities;
  }

  get Network(): Class<BaseNetwork> {
    return BaseNetwork;
  }

  get Simulation(): Class<BaseSimulation> {
    return BaseSimulation;
  }

  override get activities(): NodeActivities {
    return this._activities as NodeActivities;
  }

  get baseNetwork(): BaseNetwork {
    return this._network;
  }

  get baseSimulation(): BaseSimulation {
    return this._simulation;
  }

  override get hashObject(): IBaseState {
    return {
      description: this.description,
      id: this.id,
      name: this.name,
      network: this._network.hash,
      simulation: this._simulation.hash,
    };
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
  override changes(props: { cleanPanels?: boolean; preventSimulation?: boolean; resetPanels?: boolean } = {}): void {
    this.updateHash();

    this.state.checkChanges();

    this.logger.trace("changes");

    this.activities.checkRecorders();

    // this.generateCode();

    this.networkRevision.commit();

    if (props.cleanPanels) this._activityGraph.activityChartGraph.cleanPanels();
    if (props.resetPanels) this._activityGraph.activityChartGraph.resetPanels();

    if (!props.preventSimulation) this.startSimulationOnChange();
  }

  /**
   * Checkout network.
   */
  checkoutNetwork(): void {
    this.logger.trace("checkout network");

    const networkState = this._networkRevision.load();
    this.network.load(networkState);
    this.network.clean();

    // Generate simulation code.
    // this.generateCode();

    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace?.views.project;
    if (projectViewStore?.state.simulationEvents.onCheckout) {
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

    // // Initialize network.
    // this.network.init();

    // // Initialize network history.
    // this.networkRevision.init();

    // // Initialize simulation.
    // this.simulation.init();

    // // Initialize activities.
    // this.activities.init();

    // // Initialize activity graph.
    // this.activityGraph.init();

    this.updateHash();
    this.doc.hash = this.hash;

    this.clean();
  }

  /**
   * Load network project from state.
   * @param projectState network project state
   */
  override load(projectState: INetworkProjectState): void {
    this.logger.trace("load");

    super.load(projectState);
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
    const projectViewStore = appStore.currentWorkspace?.views.project;
    if (!projectViewStore?.state.simulationEvents.onChange) openLoading("Simulating... Please wait");

    const simtoc = Date.now();
    this.simulation
      .start(this.code.script)
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        this.state.state.stopwatch.simulation = Date.now() - simtoc;

        if (response == null || response.status !== 200 || response.data == null || !response.data.data) return;

        const vistoc = Date.now();
        // Update activities.
        this.activities.update(response.data.data);
        this.state.state.stopwatch.visualization = Date.now() - vistoc;

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
    const appStore = useAppStore();
    const projectViewStore = appStore.currentWorkspace?.views.project;
    if (projectViewStore?.state.simulationEvents.onChange) nextTick(() => this.startSimulation());
  }

  /**
   * Save network project to state.
   * @return network project state
   */
  override save(): INetworkProjectState {
    this.logger.trace("save");

    const projectState = super.save();

    projectState.network = this.network.save();
    projectState.simulation = this.simulation.save();

    return projectState;
  }
}
