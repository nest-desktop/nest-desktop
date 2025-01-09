// project.ts

import { nextTick } from "vue";

import { TActivityGraph, TStore, TSimulation, TProject } from "@/types";
import { closeLoading, openLoading, useAppStore } from "@/stores/appStore";
import { truncate } from "@/utils/truncate";
import { useModelDBStore } from "@/stores/model/modelDBStore";

import { Activities } from "../activity/activities";
import { AxiosResponse } from "axios";
import { BaseActivityGraph, IBaseActivityGraphProps } from "../activityGraph/activityGraph";
import { BaseObj } from "../common/base";
import { BaseSimulation, ISimulationProps } from "../simulation/simulation";
import { IAxiosResponseData } from "@/stores/defineBackendStore";
import { IDoc } from "../common/database";
import { NodeActivities } from "../nodeActivity/nodeAactivities";
import { ProjectState } from "./projectState";

export interface IBaseProjectProps extends IDoc {
  activityGraph?: IBaseActivityGraphProps;
  description?: string;
  name?: string;
  simulation?: ISimulationProps;
}

export class BaseProject extends BaseObj {
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _doc; // raw data of the database
  private _filename: string;
  private _id: string; // id of the project
  private _modelDBStore: TStore;
  private _name: string; // project name
  private _state: ProjectState;
  private _updatedAt: string | undefined; // when is it updated in database
  public _activities: Activities | NodeActivities;
  public _activityGraph: TActivityGraph; // activity graph
  public _simulation: TSimulation; // settings for the simulation

  constructor(projectProps: IBaseProjectProps = {}) {
    super({ logger: { settings: { minLevel: 3 } } });

    // Database instance.
    this._doc = projectProps || {};
    this._id = projectProps.id || this.uuid;
    this._createdAt = projectProps.createdAt || new Date().toLocaleDateString();
    this._updatedAt = projectProps.updatedAt;

    // Project metadata.
    this._name = projectProps.name || "";
    this._description = projectProps.description || "";
    this._filename = projectProps.filename || "";

    // Initialize model database.
    this.initModelStore();

    // Construct components.
    this._state = new ProjectState(this);

    this._simulation = new this.Simulation(this, projectProps.simulation);
    this._activities = new this.Activities(this);
    this._activityGraph = new this.ActivityGraph(this, projectProps.activityGraph);

    // Initialize components.
    // nextTick(() => this.init());
  }

  get Activities() {
    return Activities;
  }

  get ActivityGraph() {
    return BaseActivityGraph;
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

  get baseSimulation(): BaseSimulation {
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

  get doc() {
    return this._doc;
  }

  get docId(): string | undefined {
    return this._doc._id;
  }

  get filename(): string {
    return this._filename;
  }

  get id(): string {
    return this._id;
  }

  get modelDBStore() {
    return this._modelDBStore;
  }

  set modelDBStore(value: TStore) {
    this._modelDBStore = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
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
   * Generate code.
   */
  generateCodes(): void {
    this._simulation.code.generate();
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates codes in the code editor.
   * It commits the network in the network history.
   */
  changes(props = { resetPanels: false }): void {
    this.updateHash();

    this._state.checkChanges();

    this.logger.trace("changes");

    this._activities.checkRecorders();

    this.generateCodes();

    // It resets panels of activity chart graph.
    if (props.resetPanels) this._activityGraph.activityChartGraph.resetPanels();

    this.startSimulationOnChange();
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
   * It generates new project id and empties updatedAt variable;
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

    // Initialize simulation.
    this.simulation.init();

    // Initialize activities.
    this.activities.init();

    // Initialize activity graph.
    this.activityGraph.init();

    this.updateHash();
    this.doc.hash = this.hash;

    this.clean();
  }

  /**
   * Initialize model store.
   * @remarks It will be overridden by simulator components.
   */
  initModelStore(): void {
    this._modelDBStore = useModelDBStore();
  }

  /**
   * Start simulation.
   */
  startSimulation(): void {
    this.logger.trace("start simulation");

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
  toJSON(): IBaseProjectProps {
    const projectProps: IBaseProjectProps = {
      activityGraph: this._activityGraph.toJSON(),
      createdAt: this._createdAt,
      description: this._description,
      id: this._id,
      name: this._name,
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
    });
  }
}
