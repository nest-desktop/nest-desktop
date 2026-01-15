// project.ts

import { type ICodeGraphViewModel, useCodeGraph } from "@babsey/code-graph";

import type { Class, TActivityGraph, TStore } from "@/types";
import { Activities, type NodeActivities } from "@/activity";
import { BaseActivityGraph, type IBaseActivityGraphState } from "@/activityGraph";
import { BaseObj, type IDoc } from "@/core";
import { truncate } from "@/utils";
import { type IProjectCodeState, ProjectCode, registerDefaultNodeTypes } from "@/codeGraph";
import { useModelDBStore } from "@/model";

import { ProjectState } from "./helpers/projectState";

export interface IProjectState extends IDoc {
  activityGraph?: IBaseActivityGraphState;
  code?: IProjectCodeState;
  description?: string;
  name?: string;
}

export class BaseProject<TProjectState extends IProjectState = IProjectState> extends BaseObj<TProjectState> {
  private _code: ProjectCode;
  private _createdAt: string; // when is it created in database
  private _description: string = ""; // description about the project
  private _doc: IDoc = { hash: "" }; // raw data of the database
  private _filename: string = "";
  private _id: string; // id of the project
  private _modelDBStore: TStore;
  private _name: string = ""; // project name
  private _state: ProjectState;
  private _updatedAt: string | undefined; // when is it updated in database
  private _viewModel: ICodeGraphViewModel;
  public _activities: Activities | NodeActivities;
  public _activityGraph: TActivityGraph; // activity graph

  constructor() {
    super();

    // Database instance
    this._id = this.uuid;
    this._createdAt = new Date().toLocaleDateString();

    // Initialize model database
    this.initModelStore();

    // State
    this._state = new ProjectState(this);

    // Code
    this._code = new ProjectCode(this);

    // Code view model
    this._viewModel = useCodeGraph({ code: this._code });
    registerDefaultNodeTypes(this.viewModel);

    // Activity
    this._activities = new this.Activities(this);
    this._activityGraph = new this.ActivityGraph(this);
  }

  get Activities(): Class<Activities> {
    return Activities;
  }

  get ActivityGraph(): Class<BaseActivityGraph> {
    return BaseActivityGraph;
  }

  get activities(): Activities {
    return this._activities;
  }

  get activityGraph(): TActivityGraph {
    return this._activityGraph;
  }

  get code(): ProjectCode {
    return this._code;
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

  // override get hashObject(): IBaseState {
  //   return {
  //     description: this._description,
  //     id: this._id,
  //     name: this._name,
  //   };
  // }

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

  get viewModel(): ICodeGraphViewModel {
    return this._viewModel;
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates codes in the code editor.
   * It commits the network in the network history.
   */
  changes(state: { resetPanels?: boolean } = {}): void {
    // this.updateHash();

    this.state.checkChanges();

    this.logger.trace("changes");

    this.activities.checkRecorders();

    // this.generateCode();

    // It resets panels of activity chart graph.
    if (state.resetPanels) this._activityGraph.activityChartGraph.resetPanels();
  }

  /**
   * Clean project.
   *
   * @remarks
   * Update hash of this project.
   */
  clean(): void {
    this.logger.trace("clean");

    // this.updateHash();

    this._state.checkChanges();
  }

  // /**
  //  * Generate code.
  //  */
  // generateCode(): void {
  //   this.code.generate();
  // }

  /**
   * Initialize project.
   */
  init(): void {
    this.logger.trace("init");

    // Initialize activities.
    this.activities.init();

    // Initialize activity graph.
    this.activityGraph.init();

    // this.updateHash();
    // this.doc.hash = this.hash;

    this.clean();
  }

  /**
   * Load project from state.
   * @param projectState project state
   */
  load(projectState: IProjectState): void {
    this.logger.trace("load");

    // Database instance
    this._doc = projectState;

    if (projectState.id) this._id = projectState.id;
    if (projectState.createdAt) this._createdAt = projectState.createdAt;
    if (projectState.updatedAt) this._updatedAt = projectState.updatedAt;

    // Project metadata
    if (projectState.name) this._name = projectState.name;
    if (projectState.description) this._description = projectState.description;
    if (projectState.filename) this._filename = projectState.filename as string;

    // Load code.
    if (projectState.code) this.code.load(projectState.code);
  }

  /**
   * Initialize model store.
   * @remarks It will be overridden by simulator components.
   */
  initModelStore(): void {
    this._modelDBStore = useModelDBStore();
  }

  /**
   * Save project to state.
   * @return project state
   */
  override save(): IProjectState {
    this.logger.trace("save");

    const projectState: IProjectState = {
      activityGraph: this.activityGraph.save(),
      createdAt: this._createdAt,
      description: this._description,
      id: this._id,
      name: this._name,
      updatedAt: this._updatedAt,
      version: process.env.APP_VERSION as string,
    };

    if (this.code.graph && this.code.graph.nodes.length > 0) projectState.code = this.code.save();

    return projectState;
  }
}
