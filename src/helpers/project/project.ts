// project.ts

import { nextTick } from "vue";

import { Activities } from "../activity/activities";
import { Activity } from "../activity/activity";
import { ActivityGraph } from "../activity/activityGraph";
import { BaseNetwork, INetworkProps } from "../network/network";
import { BaseObj } from "../common/base";
import { BaseSimulation, ISimulationProps } from "../simulation/simulation";
import { NetworkRevision } from "../network/networkRevision";
import { ProjectState } from "./projectState";
import { TNetwork } from "@/types/networkTypes";
import { TProject } from "@/types/projectTypes";
import { TSimulation } from "@/types/simulationTypes";
import { truncate } from "@/utils/truncate";
import { useModelDBStore } from "@/stores/model/modelDBStore";
import { useProjectViewStore } from "@/stores/project/projectViewStore";

export interface IProjectProps {
  activityGraph?: any;
  createdAt?: string;
  description?: string;
  id?: string;
  name?: string;
  network?: INetworkProps;
  simulation?: ISimulationProps;
  updatedAt?: string;
  version?: string;
}

export class BaseProject extends BaseObj {
  private _activities: Activities;
  private _activityGraph: ActivityGraph;
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _doc: any; // raw data of the database
  private _id: string; // id of the project
  private _modelDBStore: any;
  private _name: string; // project name
  private _networkRevision: NetworkRevision; // network history
  private _state: ProjectState;
  private _updatedAt: string | undefined; // when is it updated in database
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
    this._activityGraph = projectProps.activityGraph;

    // Initialize database.
    this.initModelStore();

    // Construct components.
    this._state = new ProjectState(this);
    this._simulation = new this.Simulation(this, projectProps.simulation);
    this._network = new this.Network(this, projectProps.network);
    this._networkRevision = new NetworkRevision(this);
    this._activities = new Activities(this);
    this._activityGraph = new ActivityGraph(this, projectProps.activityGraph);

    // Initialize components.
    nextTick(() => this.init());
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

  get activityGraph() {
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
    return this._doc ? this._doc._id : undefined;
  }

  get id(): string {
    return this._id;
  }

  get modelDBStore() {
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
   * @returns 6-digit hash value
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

  // /**
  //  * Is the current project selected?
  //  */
  // get isSelected(): boolean {
  //   return this.id === this._projectStore.projectId;
  // }

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

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
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

    return new BaseProject({ ...this.toJSON(), id: undefined, updatedAt: "" });
  }

  // /**
  //  * Clone this current project and add it to the list.
  //  *
  //  * @remarks
  //  * It pushes new project to the first line of the list.
  //  */
  // duplicate(): Project {
  //   this._logger.trace("duplicate");
  //   const newProject: BaseProject = this.clone();
  //   this._projectStore.addProject(newProject);
  //   return newProject;
  // }

  // /**
  //  * Delete this project from the list and database.
  //  */
  // async delete(): Promise<any> {
  //   this._logger.trace("delete");
  //   return this._projectStore.db.removeProject(this);
  // }

  // /**
  //  * Export this project.
  //  */
  // export(): void {
  //   this._logger.trace("export");
  //   this._projectStore.db.exportProject(this.id);
  // }

  // /**
  //  * Export this project and activities.
  //  */
  // exportWithActivities(): void {
  //   this._logger.trace("export with activities");
  //   this._projectStore.db.exportProject(this.id, true);
  // }

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

  // /**
  //  * Reload this project.
  //  */
  // async reload(): Promise<any> {
  //   this._logger.trace("reload");
  //   return this._projectStore.db.reloadProject(this._id);
  // }

  // /**
  //  * Save the current project.
  //  */
  // save(): void {
  //   this._state.state.editMode = false;
  //   this._projectStore.db.saveProject(this);
  // }

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

  /*
   * Activities
   */

  /**
   * Serialization
   */

  /**
   * Serialize for JSON.
   * @return project object
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

  // /**
  //  * Unload this project.
  //  */
  // async unload(): Promise<any> {
  //   this._logger.trace("unload");
  //   return this._projectStore.db.unloadProject(this.id);
  // }

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
