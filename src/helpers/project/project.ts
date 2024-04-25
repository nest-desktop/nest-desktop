// project.ts

import { nextTick } from "vue";

import { Activities } from "../activity/activities";
import { Activity } from "../activity/activity";
import {
  BaseActivityGraph,
  IBaseActivityGraphProps,
} from "../activity/activityGraph";
import { BaseNetwork, INetworkProps } from "../network/network";
import { BaseObj } from "../common/base";
import { BaseSimulation, ISimulationProps } from "../simulation/simulation";
import { IDoc } from "../common/database";
import { NetworkRevision } from "../network/networkRevision";
import { ProjectState } from "./projectState";
import { Store } from "pinia";
import { TActivityGraph } from "@/types/activityGraphTypes";
import { TNetwork } from "@/types/networkTypes";
import { TProject } from "@/types/projectTypes";
import { TSimulation } from "@/types/simulationTypes";
import { truncate } from "@/utils/truncate";
import { useModelDBStore } from "@/stores/model/modelDBStore";
import { useProjectViewStore } from "@/stores/project/projectViewStore";

export interface IProjectProps extends IDoc {
  activityGraph?: IBaseActivityGraphProps;
  description?: string;
  name?: string;
  network?: INetworkProps;
  simulation?: ISimulationProps;
}

export class BaseProject extends BaseObj {
  private _activities: Activities;
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _doc: any; // raw data of the database
  private _id: string; // id of the project
  private _modelDBStore: Store<string, any>;
  private _name: string; // project name
  private _networkRevision: NetworkRevision; // network history
  private _state: ProjectState;
  private _updatedAt: string | undefined; // when is it updated in database
  public _activityGraph: TActivityGraph; // activity graph
  public _network: TNetwork; // network of neurons and devices
  public _simulation: BaseSimulation; // settings for the simulation

  constructor(projectProps: IProjectProps = {}) {
    super({ logger: { settings: { minLevel: 3 } } });

    // Database instance.
    this._doc = projectProps || {};
    this._id = projectProps.id || this.uuid;
    this._createdAt = projectProps.createdAt || new Date().toLocaleDateString();
    this._updatedAt = projectProps.updatedAt;

    // Project metadata.
    this._name = projectProps.name || "undefined project";
    this._description = projectProps.description || "";

    // Initialize model database.
    this.initModelStore();

    // Construct components.
    this._state = new ProjectState(this);
    this._simulation = new this.Simulation(this, projectProps.simulation);
    this._network = new this.Network(this, projectProps.network);
    this._networkRevision = new NetworkRevision(this);
    this._activities = new Activities(this);
    this._activityGraph = new this.ActivityGraph(
      this,
      projectProps.activityGraph
    );

    // Initialize components.
    nextTick(() => this.init());
  }

  get ActivityGraph() {
    return BaseActivityGraph;
  }

  get Network() {
    return BaseNetwork;
  }

  get Simulation() {
    return BaseSimulation;
  }

  get activities(): Activities {
    return this._activities;
  }

  get activityGraph(): TActivityGraph {
    return this._activityGraph;
  }

  get baseNetwork(): TNetwork {
    return this._network;
  }

  get baseSimulation(): TSimulation {
    return this._simulation;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get description(): string {
    return this._description;
  }

  get doc(): any {
    return this._doc;
  }

  set doc(value: any) {
    this._doc = value;
  }

  get docId(): string | undefined {
    return this._doc?._id;
  }

  get id(): string {
    return this._id;
  }

  get modelDBStore(): Store<string, any> {
    return this._modelDBStore;
  }

  set modelDBStore(value: any) {
    this._modelDBStore = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
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
   * Returns the first six digits of the project ID.
   * @returns 6-digit id value
   */
  get shortId(): string {
    return this._id ? truncate(this._id) : "";
  }

  get state(): ProjectState {
    return this._state;
  }

  get updatedAt(): string | undefined {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates simulation code in the code editor.
   * It commits the network in the network history.
   */
  changes(): void {
    this.updateHash();
    this._state.checkChanges();

    this.logger.trace("changes");
    this._activities.checkRecorders();

    this._simulation.code.generate();

    this._networkRevision.commit();

    // Simulate when the configuration is set and the view mode is activity explorer.
    const projectViewStore = useProjectViewStore();
    if (projectViewStore.state.simulateAfterChange.value) {
      nextTick(() => this.startSimulation());
    }
  }

  /**
   * Checkout network.
   */
  checkoutNetwork(): void {
    const network = this._networkRevision.load();
    this._network.update(network);
    this._network.clean();

    // Generate simulation code.
    this._simulation.code.generate();

    const projectViewStore = useProjectViewStore();
    if (projectViewStore.state.simulateAfterCheckout.value) {
      // Run simulation.
      nextTick(() => this.startSimulation());
    } else {
      // Update activities.
      this.activities.update(
        this.activities.all.map((activity: Activity) => activity.toJSON())
      );

      // Update activities in activity graph.
      this._activityGraph.activityChartGraph.updateActivities();

      // Update activity graph.
      this._activityGraph.update();
    }
  }

  /**
   * Clean project.
   *
   * @remarks
   * Update hash of this project.
   */
  clean(): void {
    this.logger.trace("clean");

    this.updateHash();
    this._state.checkChanges();
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates ne project id and empties updatedAt variable;
   */
  clone(): TProject {
    this.logger.trace("clone");

    return new BaseProject({ ...this.toJSON(), id: "", updatedAt: "" });
  }

  /**
   * Initialize project.
   */
  init(): void {
    this.logger.trace("init");

    // Initialize network.
    this.network.init();

    // Initialize network history.
    this.networkRevision.init();

    // Initialize simulation.
    this.simulation.init();

    // Initialize activities.
    this.activities.init();

    // Initialize activity graph.
    this.activityGraph.init();

    this.clean();
  }

  /**
   * Initialize model store.
   *
   * @remarks
   * It will be overridden by simulator components.
   */
  initModelStore(): void {
    this._modelDBStore = useModelDBStore();
  }

  /**
   * Start simulation.
   */
  startSimulation(): void {
    this.logger.trace("start simulation");
    this._network.clean();

    // Reset activities and activity graphs.
    this.activities.reset();

    this._simulation.start().then((response: any) => {
      if (
        response == null ||
        response.status !== 200 ||
        response.data == null ||
        !response.data.data
      ) {
        return;
      }

      // Update activities.
      this.activities.update(response.data.data);

      // Commit network for the history.
      this.networkRevision.commit();
    });
  }

  /**
   * Serialize for JSON.
   * @return project props
   */
  toJSON(): IProjectProps {
    const projectProps: IProjectProps = {
      // activityGraph: this._activityGraph.toJSON(),
      createdAt: this._createdAt,
      description: this._description,
      id: this._id,
      name: this._name,
      network: this._network.toJSON(),
      simulation: this._simulation.toJSON(),
      updatedAt: this._updatedAt,
      version: process.env.APP_VERSION as string,
    };
    return projectProps;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      description: this._description,
      id: this._id,
      name: this._name,
      network: this._network.hash,
      simulation: this._simulation.hash,
    });
  }
}
