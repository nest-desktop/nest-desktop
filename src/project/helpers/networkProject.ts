// project.ts

import { nextTick } from "vue";
import type { AxiosResponse } from "axios";

import type { Class, TNetwork, TSimulation } from "@/types";
import type { IAxiosResponseData } from "@/backends";
import { BaseSimulation, type ISimulationState } from "@/simulation";
import { NodeActivities } from "@/activity";
import { closeLoading, openLoading, getCurrentViewStore } from "@/app";
import { type INetworkState, BaseNetwork } from "@/network";

import { BaseProject, type IProjectState } from "../project";

export interface INetworkProjectState extends IProjectState {
  network?: INetworkState;
  simulation?: ISimulationState;
}

// export class NetworkProject<TNode extends BaseNode<AbstractModel>> extends AbstractProject{
export abstract class NetworkProject<
  TNetworkProjectState extends INetworkProjectState = INetworkProjectState,
> extends BaseProject<TNetworkProjectState> {
  public _network: BaseNetwork; // network of neurons and devices
  public _simulation: TSimulation; // settings for the simulation

  constructor() {
    super();

    // Initialize model database.
    this.initModelStore();

    // Construct components.
    this._network = new this.Network(this);
    this._simulation = new this.Simulation(this);
  }

  override get Activities(): Class<NodeActivities> {
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

  get network(): TNetwork {
    return this._network;
  }

  get simulation(): TSimulation {
    return this._simulation;
  }

  // /**
  //  * Observer for network changes
  //  *
  //  * @remarks
  //  * It generates codes in the code editor.
  //  * It commits the network in the network history.
  //  */
  // override changes(props: { cleanPanels?: boolean; preventSimulation?: boolean; resetPanels?: boolean } = {}): void {
  //   this.logger.trace("changes");
  //   // this.updateHash();

  //   // this.state.checkChanges();

  //   this.activities.checkRecorders();

  //   if (props.cleanPanels) this.activityGraph.activityChartGraph.cleanPanels();
  //   if (props.resetPanels) this.activityGraph.activityChartGraph.resetPanels();

  //   if (!props.preventSimulation) this.startSimulationOnChange();
  // }

  // /**
  //  * Initialize project.
  //  */
  // override init(): void {
  //   this.logger.trace("init");

  //   // Initialize network.
  //   this.network.init();

  //   // // Initialize simulation.
  //   // this.simulation.init();

  //   // Initialize activities.
  //   this.activities.init();

  //   // // Initialize activity graph.
  //   this.activityGraph.init();

  //   this.clean();
  // }

  // /**
  //  * Load network project from state.
  //  * @param projectState network project state
  //  */
  // override load(projectState: INetworkProjectState): void {
  //   this.logger.trace("load");

  //   super.load(projectState);
  // }

  /**
   * Start simulation.
   */
  startSimulation(): void {
    this.logger.trace("start simulation");

    this.network.clean();

    // Reset activities and activity graphs.
    this.activities.reset();
    // this.activityGraph.reset()

    this.activities.checkRecorders();
    this.activityGraph.activityChartGraph.cleanPanels();

    const projectViewStore = getCurrentViewStore("project");
    if (!projectViewStore?.state.simulationEvents.onChange) openLoading("Simulating... Please wait");

    const simtoc = Date.now();
    this.simulation
      .start(this.code.script)
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        this.state.state.stopwatch.simulation = Date.now() - simtoc;

        if (response == null || response.status !== 200 || response.data == null || !response.data.data) return;

        const vistoc = Date.now();
        this.activities.update(response.data.data); // Update activities.
        this.state.state.stopwatch.visualization = Date.now() - vistoc;

        // Commit network for the history (with activity).
        // this.network.revision.commit(true);
      })
      .finally(() => {
        closeLoading();
      });
  }

  /**
   * Simulate when the configuration is set.
   */
  startSimulationOnChange(): void {
    const projectViewStore = getCurrentViewStore("project");
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
