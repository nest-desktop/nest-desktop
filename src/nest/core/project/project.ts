// project.ts

import { v4 as uuidv4 } from "uuid";
import { ILogObj, Logger } from "tslog";
import { logger as mainLogger } from "@/utils/logger";

import { useModelDBStore } from "@nest/store/model/modelDBStore";
import { useProjectDBStore } from "@nest/store/project/projectDBStore";
import { useProjectStore } from "@nest/store/project/projectStore";

import { ActivityGraph } from "@nest/graph/activityGraph/activityGraph";
import { Insite } from "../insite/insite";
import { Network, NetworkProps } from "../network/network";
import { ProjectState } from "./projectState";
import { Simulation, SimulationProps } from "../simulation/simulation";
import { upgradeProject } from "../upgrades/upgrades";
import { Activities } from "../activity/activities";

export interface ProjectProps {
  _id?: string;
  _rev?: string;
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

export class Project {
  private _activities: Activities;
  private _activityGraph: ActivityGraph;
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _doc: any; // doc data of the database
  private _id: string; // id of the project
  private _insite: Insite; // insite
  private _logger: Logger<ILogObj>;
  private _modelStore;
  private _name: string; // project name
  private _network: Network; // network of neurons and devices
  private _projectDBStore;
  private _projectStore;
  private _rev: string; // rev of the project
  private _simulation: Simulation; // settings for the simulation
  private _state: ProjectState;
  private _updatedAt: string | undefined; // when is it updated in database

  constructor(project: ProjectProps = {}) {
    this._modelStore = useModelDBStore();
    this._projectDBStore = useProjectDBStore();
    this._projectStore = useProjectStore();

    // Database instance
    this._doc = project || {};
    this._id = project._id || uuidv4();
    this._rev = project._rev || "";
    this._createdAt = project.createdAt || new Date().toLocaleDateString();
    this._updatedAt = project.updatedAt;

    // Project metadata
    this._name = project.name || "undefined project";
    this._description = project.description || "";

    this._logger = mainLogger.getSubLogger({
      name: `[${this.shortId}] project`,
    });

    // Initialize project state.
    this._state = new ProjectState(this);
    this._insite = new Insite(this);

    // Upgrade old projects.
    project = upgradeProject(project);

    // Initialize simulation.
    this._simulation = new Simulation(this, project.simulation);

    // Initialize network.
    this._network = new Network(this, project.network);

    // Initialize activities.
    this._activities = new Activities(this);
    this._activityGraph = new ActivityGraph(this, project.activityGraph);

    this.clean();
  }

  get activities(): Activities {
    return this._activities;
  }

  get activityGraph(): ActivityGraph {
    return this._activityGraph;
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

  get docId(): string {
    return this._doc ? this._doc._id : undefined;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get insite(): Insite {
    return this._insite;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get modelStore() {
    return this._modelStore;
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

  get rev(): string {
    return this._rev;
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

  // set updatedAt(value: string) {
  //   this._updatedAt = value;
  // }

  /**
   * Is the current project selected?
   */
  get isSelected(): boolean {
    return this._id === this._projectStore.projectId;
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
   * It generates new project id and empties updatedAt variable;
   */
  clone(): Project {
    this._logger.trace("clone");
    const newProject = new Project(this.toJSON());
    newProject._id = uuidv4();
    newProject._updatedAt = "";
    newProject.init();
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
    const newProject: Project = this.clone();
    this._projectDBStore.addProject(newProject);
    return newProject;
  }

  /**
   * Delete this project from the list and database.
   */
  async delete(): Promise<any> {
    this._logger.trace("delete");
    return this._projectDBStore.deleteProject(this._id);
  }

  /**
   * Export this project.
   */
  export(): void {
    this._logger.trace("export");
    this._projectDBStore.exportProject(this._id);
  }

  /**
   * Export this project and activities.
   */
  exportWithActivities(): void {
    this._logger.trace("export with activities");
    this._projectDBStore.exportProject(this._id, true);
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
    if (this._activityGraph == undefined) {
      return;
    }

    this._activityGraph.init();
    if (this.activities.state.hasSomeEvents) {
      this._activityGraph.update();
    }
  }

  /**
   * Reload this project.
   */
  async reload(): Promise<any> {
    this._logger.trace("reload");
    return this._projectDBStore.reloadProject(this._id);
  }

  /**
   * Save the current project.
   */
  save(): void {
    this._projectDBStore.saveProject(this.id).then(() => this.clean());
  }

  /**
   * Start simulation.
   */
  startSimulation(): void {
    this._logger.trace("start simulation");
    this._network.clean();

    // Stop getting activities from Insite.
    this.insite.cancelAllIntervals();

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

      // Initialize activities
      this.activities.update(response.data.data);

      // Commit network for the history.
      this.network.commit();
    });

    if (this._simulation.code.runSimulationInsite) {
      // Update time info during the simulation.
      this.insite.continuouslyUpdateSimulationTimeInfo(250);

      // Update activity graph during the simulation.
      this.insite.continuouslyUpdateActivityGraph(500);

      // Get activities from Insite.
      this.insite.getActivities();
    }
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
      activityGraph: this._activityGraph.toJSON(),
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
    return this._projectDBStore.unloadProject(this._id);
  }
}
