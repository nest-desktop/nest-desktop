// project.ts

import { v4 as uuidv4 } from "uuid";
import { ILogObj, Logger } from "tslog";

import { Activities } from "@/helpers/activity/activities";
import { ActivityGraph } from "@/helpers/activity/activityGraph";
import { BaseNetwork, NetworkProps } from "@/helpers/network/network";
import {
  BaseSimulation,
  SimulationProps,
} from "@/helpers/simulation/simulation";
import { Network } from "@/types/networkTypes";
import { Project } from "@/types/projectTypes";
import { ProjectState } from "./projectState";
import { Simulation } from "@/types/simulationTypes";
import { logger as mainLogger } from "@/helpers/common/logger";
import { useModelDBStore } from "@/store/model/modelDBStore";

export interface ProjectProps {
  activityGraph?: any;
  createdAt?: string;
  description?: string;
  id?: string;
  name?: string;
  network?: NetworkProps;
  simulation?: SimulationProps;
  updatedAt?: string;
  version?: string;
}

export class BaseProject {
  private _activities: Activities;
  private _activityGraph: ActivityGraph;
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _doc: any; // raw data of the database
  private _id: string; // id of the project
  private _logger: Logger<ILogObj>;
  private _modelDBStore: any;
  private _name: string; // project name
  public _network: BaseNetwork; // network of neurons and devices
  private _projectStore: any;
  public _simulation: BaseSimulation; // settings for the simulation
  private _state: ProjectState;
  private _updatedAt: string | undefined; // when is it updated in database

  constructor(project: ProjectProps = {}) {
    // Database instance
    this._doc = project || {};
    this._id = project.id || uuidv4();
    this._createdAt = project.createdAt || new Date().toLocaleDateString();
    this._updatedAt = project.updatedAt;

    // Project metadata
    this._name = project.name || "undefined project";
    this._description = project.description || "";
    this._activityGraph = project.activityGraph;

    this._logger = mainLogger.getSubLogger({
      name: `[${this.shortId}] project`,
    });

    // Initialize database.
    this.initStore();

    // Initialize project state.
    this._state = new ProjectState(this);

    // Initialize network.
    this._network = this.newNetwork(project.network);

    // Initialize simulation.
    this._simulation = this.newSimulation(project.simulation);

    // Initialize activities.
    this._activities = new Activities(this);

    // Initialize activity graph.
    this._activityGraph = new ActivityGraph(this, project.activityGraph);

    this.clean();
  }

  get activities(): Activities {
    return this._activities;
  }

  get activityGraph() {
    return this._activityGraph;
  }

  get baseNetwork(): Network {
    return this._network;
  }

  get baseSimulation(): Simulation {
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

  get logger(): Logger<ILogObj> {
    return this._logger;
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

  get network(): Network {
    return this._network;
  }

  get projectStore() {
    return this._projectStore;
  }

  set projectStore(value) {
    this._projectStore = value;
  }

  get simulateAfterCheckout(): boolean {
    return this._projectStore.simulateAfterCheckout;
  }

  get simulation(): Simulation {
    return this._simulation;
  }

  /**
   * Returns the first six digits of the project ID.
   * @returns 6-digit hash value
   */
  get shortId(): string {
    return this._id ? this._id.slice(0, 6) : "";
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
   * Is the current project selected?
   */
  get isSelected(): boolean {
    return this.id === this._projectStore.projectId;
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
    this._state.updateHash();
    this._state.checkChanges();

    this._logger.trace("changes");
    this._activities.checkRecorders();
    this._simulation.code.generate();

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    // const projectView = this._project.app.project.view;
    // if (
    //   projectView.config.simulateAfterChange &&
    //   projectView.state.modeIdx === 1
    // ) {
    //   setTimeout(() => this.startSimulation(), 1);
    // }
  }

  /**
   * Clean project.
   *
   * @remarks
   * Clean project code.
   * Update hash of this project.
   */
  clean(): void {
    this._logger.trace("clean");
    this._simulation.code.clean();
    this._state.updateHash();
    this._state.checkChanges();
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates ne project id and empties updatedAt variable;
   */
  clone(): Project {
    this._logger.trace("clone");
    const newProject = new BaseProject({ ...this.toJSON() });
    // newProject._id = uuidv4();
    // newProject._updatedAt = "";
    // newProject.init();
    return newProject;
  }

  /**
   * Clone this current project and add it to the list.
   *
   * @remarks
   * It pushes new project to the first line of the list.
   */
  duplicate(): Project {
    this._logger.trace("duplicate");
    const newProject: BaseProject = this.clone();
    this._projectStore.db.addProject(newProject);
    return newProject;
  }

  /**
   * Delete this project from the list and database.
   */
  async delete(): Promise<any> {
    this._logger.trace("delete");
    return this._projectStore.db.removeProject(this);
  }

  /**
   * Export this project.
   */
  export(): void {
    this._logger.trace("export");
    this._projectStore.db.exportProject(this.id);
  }

  /**
   * Export this project and activities.
   */
  exportWithActivities(): void {
    this._logger.trace("export with activities");
    this._projectStore.db.exportProject(this.id, true);
  }

  /**
   * Initialize project.
   */
  init(generateCode: boolean = true): void {
    this._logger.trace("init");
    this.clean();

    if (generateCode) {
      setTimeout(() => {
        this._simulation.code.generate();
      });
    }
    // Reset network graph.
    this._network.nodes.resetState();

    // Commit network in history.
    this.network.commit();
  }

  /**
   * Initialize activity graph.
   */
  initActivityGraph(): void {
    this._logger.trace("init activity graph");
    this._activityGraph.init();
  }

  /**
   * Initialize store.
   */
  initStore(): void {
    this._modelDBStore = useModelDBStore();
    // this._projectStore = useProjectStore();
  }

  newNetwork(data?: NetworkProps): Network {
    return new BaseNetwork(this, data);
  }

  newSimulation(data?: SimulationProps): Simulation {
    return new BaseSimulation(this, data);
  }

  /**
   * Reload this project.
   */
  async reload(): Promise<any> {
    this._logger.trace("reload");
    return this._projectStore.db.reloadProject(this._id);
  }

  /**
   * Save the current project.
   */
  save(): void {
    this._state.state.editMode = false;
    this._projectStore.db.saveProject(this);
  }

  /**
   * Start simulation.
   */
  startSimulation(): void {
    this._logger.trace("start simulation");
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
      this.network.commit();
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
  toJSON(): ProjectProps {
    const project: ProjectProps = {
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
    return project;
  }

  /**
   * Unload this project.
   */
  async unload(): Promise<any> {
    this._logger.trace("unload");
    return this._projectStore.db.unloadProject(this.id);
  }
}
