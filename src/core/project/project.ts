import * as objectHash from 'object-hash';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

import { Activity } from '../activity/activity';
import { ActivityGraph } from '../activity/activityGraph';
import { App } from '../app';
import { Config } from '../config';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { ProjectCode } from './projectCode';
import { ProjectView } from './projectView';
import { Simulation } from '../simulation/simulation';
import { upgradeProject } from './projectUpgrade';

export class Project extends Config {
  private _activityGraph: ActivityGraph;
  private _app: App; // parent
  private _code: ProjectCode; // code script for NEST Server
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _errorMessage = '';
  private _hasActivities = false;
  private _hash: string; // obsolete: hash of serialized network
  private _hasSpatialActivities = false;
  private _id: string; // id of the project
  private _name: string; // project name
  private _network: Network; // network of neurons and devices
  private _networkRevisionIdx = -1; // Index of the network history;
  private _networkRevisions: any[] = []; // network history
  private _rev: string; // rev of the project
  private _simulation: Simulation; // settings for the simulation
  private _updatedAt: string; // when is it updated in database
  private _view: ProjectView;

  constructor(app: App, project: any = {}) {
    super('Project');
    this._app = app;
    this._view = new ProjectView(this);

    // Database instance
    this._id = project._id || uuidv4();
    this._rev = project._rev || '';
    this._createdAt = project.createdAt || new Date();
    this._updatedAt = project.updatedAt;

    this._name = project.name || '';
    this._description = project.description || '';
    this._hash = project.hash || '';
    // this.user = project.user || '';
    // this.group = project.group || '';

    // Upgrade old projects
    // const projectUpgraded: any = upgradeProject(this._app, project);
    this.initSimulation(project.simulation);
    this.initNetwork(project.network);

    this.clean();
    this._code = new ProjectCode(this);
    this._activityGraph = new ActivityGraph(this);
  }

  get activityGraph(): ActivityGraph {
    return this._activityGraph;
  }

  get app(): App {
    return this._app;
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

  get errorMessage(): string {
    return this._errorMessage;
  }

  get hash(): string {
    return this._hash;
  }

  get id(): string {
    return this._id;
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

  get simulation(): Simulation {
    return this._simulation;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }

  get view(): ProjectView {
    return this._view;
  }

  /**
   * Is the current project selected?
   */
  isSelected(): boolean {
    return this._id === this._app.project.id;
  }

  /**
   * Save the current project.
   */
  save(): Promise<any> {
    return this._app.saveProject(this);
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  clone(): Project {
    const newProject = new Project(this._app, this.toJSON());
    newProject._id = uuidv4();
    newProject._updatedAt = '';
    return newProject;
  }

  /**
   * Clone this current project and add it to the list.
   *
   * @remarks
   * It pushes new project to the first line of the list.
   */
  duplicate(): Project {
    const newProject: Project = this.clone();
    this._app.projects.unshift(newProject);
    return newProject;
  }

  /**
   * Delete this project from the list and database.
   */
  delete(): void {
    this._app.deleteProject(this._id);
  }

  /**
   * Download this project.
   */
  download(): void {
    this._app.downloadProject(this._id);
  }

  /**
   * Reload this project.
   */
  reload(): Promise<any> {
    return this._app.reloadProject(this);
  }

  /*
   * Project revisions
   */

  /**
   * Is this revised project selected?
   */
  isRevisionSelected(): boolean {
    return this._rev === this._app.project.rev;
  }

  /**
   * Networks
   */

  /**
   * Initialize a network.
   *
   * @remarks
   * It commits network after creating network component.
   */
  initNetwork(network: any = {}): void {
    this.clearNetworkHistory();
    this._network = new Network(this, network);
    this.commitNetwork(this._network);
  }

  /**
   * Get revision index of the network history.
   */
  get networkRevisionIdx(): number {
    return this._networkRevisionIdx;
  }

  /**
   * Get list of network history.
   */
  get networkRevisions(): any[] {
    return this._networkRevisions;
  }

  /** Check if network is changed
   * Use object hash.
   */
  isNetworkChanged(): boolean {
    return this._network.hash !== this._activityGraph.hash;
  }

  /**
   * Clear network history list.
   */
  clearNetworkHistory(): void {
    this._networkRevisions = [];
    this._networkRevisionIdx = -1;
  }

  /**
   * Add network to the history list.
   */
  commitNetwork(network: Network): void {
    // console.log('Commit network');
    const maxRev: number = this.config.maxNetworkRevisions || 5;
    this._networkRevisions = this._networkRevisions.slice(
      0,
      this._networkRevisionIdx + 1
    );
    if (this._networkRevisions.length > maxRev) {
      this._networkRevisions = this._networkRevisions.slice(
        this._networkRevisions.length - maxRev
      );
    }
    const currentNetwork: any = network.toJSON('revision');
    if (this._networkRevisions.length === 0) {
      this._networkRevisions.push(currentNetwork);
    } else {
      const lastNetwork: any = this._networkRevisions[
        this._networkRevisions.length - 1
      ];
      if (
        objectHash(JSON.stringify(lastNetwork)) !==
        objectHash(JSON.stringify(currentNetwork))
      ) {
        this._networkRevisions.push(currentNetwork);
      }
    }
    this._networkRevisionIdx = this._networkRevisions.length - 1;
  }

  /**
   * Load network from the history list.
   */
  checkoutNetwork(): void {
    // console.log('Checkout network');
    if (this._networkRevisionIdx >= this._networkRevisions.length) {
      this._networkRevisionIdx = this._networkRevisions.length - 1;
    }
    const oldModels: string[] = this._network.recorders.map(
      (node: Node) => node.modelId
    );
    const network: any = this._networkRevisions[this._networkRevisionIdx];
    this._network.update(network);
    const newModels: string[] = this._network.recorders.map(
      (node: Node) => node.modelId
    );

    if (
      objectHash(JSON.stringify(oldModels)) ===
      objectHash(JSON.stringify(newModels))
    ) {
      this._activityGraph.activityChartGraph.initPanels();
    } else {
      this._activityGraph.activityChartGraph.init();
    }
    if (this.config.runAfterCheckout) {
      setTimeout(() => this.runSimulation(), 1);
    } else {
      const activities: any[] = this.activities.map((activity: Activity) =>
        activity.toJSON()
      );
      this.updateActivities(activities);
    }
  }

  /**
   * Go to the older network.
   */
  networkOlder(): void {
    if (this._networkRevisionIdx > 0) {
      this._networkRevisionIdx--;
    }
    this.checkoutNetwork();
  }

  /**
   * Go to the oldest network.
   */
  networkOldest(): void {
    this._networkRevisionIdx = 0;
    this.checkoutNetwork();
  }

  /**
   * Go to the newer network.
   */
  networkNewer(): void {
    if (this._networkRevisionIdx < this._networkRevisions.length) {
      this._networkRevisionIdx++;
    }
    this.checkoutNetwork();
  }

  /**
   * Go to the newest network.
   */
  networkNewest(): void {
    this._networkRevisionIdx = this._networkRevisions.length - 1;
    this.checkoutNetwork();
  }

  /*
   * Simulation
   */

  /**
   * Create a new simulation.
   */
  initSimulation(simulation: any = {}): void {
    this._simulation = new Simulation(this, simulation);
  }

  /**
   * Start the simulation when a parameter is changed.
   */
  simulateAfterChange(): void {
    const viewActivityExplorer: boolean =
      this._app.view.project.mode === 'activityExplorer';
    if (viewActivityExplorer && this.config.runAfterChange) {
      setTimeout(() => this.runSimulation(), 1);
    }
  }

  /**
   * Start simulation.
   *
   * @remarks
   * After the simulation it updates activities and commit network.
   */
  runSimulation(): Promise<any> {
    // console.log('Run simulation');
    this._simulation.running = true;
    return this.app.nestServer.http
      .post(this._app.nestServer.url + '/exec', {
        source: this._code.script,
        return: 'response',
      })
      .then((resp: any) => {
        let data: any;
        switch (resp.status) {
          case 200:
            this._errorMessage = '';
            data = JSON.parse(resp.responseText).data;
            this._simulation.kernel.time = data.kernel.time;
            this.updateActivities(data.activities);
            this.commitNetwork(this._network);
            break;
          default:
            this._errorMessage = resp.responseText;
            break;
        }
        setTimeout(() => {
          this._simulation.running = false;
        }, 100);
        return resp;
      })
      .catch((resp: any) => {
        this._errorMessage = resp.responseText;
        setTimeout(() => {
          this._simulation.running = false;
        }, 100);
        return resp;
      });
  }

  /*
   * Activities
   */

  /**
   * Get a list of activities.
   */
  get activities(): Activity[] {
    // console.log('Get activities')
    const activities: Activity[] = this._network
      ? this._network.recorders.map((recorder: Node) => recorder.activity)
      : [];
    activities.forEach((activity: Activity, idx: number) => {
      activity.idx = idx;
    });
    return activities;
  }

  /**
   * Update activities in recorder nodes after simulation.
   */
  updateActivities(data: any): void {
    // console.log('Update activities');
    // Update recorded activity
    const activities: Activity[] = this.activities;
    data.forEach((activity: any, idx: number) => {
      activities[idx].update(activity);
    });
    this.activityGraph.update();
    this.checkActivities();
  }

  /**
   * Check whether the project has some events in (spatial) activities.
   */
  checkActivities(): void {
    const activities: Activity[] = this.activities;
    this._hasActivities =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasEvents())
        : false;
    this._hasSpatialActivities = this.hasActivities
      ? activities.some(
          (activity: Activity) =>
            activity.hasEvents() && activity.nodePositions.length > 0
        )
      : false;
  }

  /**
   * Does the project have events in activities?
   */
  get hasActivities(): boolean {
    return this._hasActivities;
  }

  /**
   * Does the project have events in spatial activities?
   */
  get hasSpatialActivities(): boolean {
    return this._hasSpatialActivities;
  }

  /**
   * Serialization
   */

  /**
   * Update hash of this project.
   */
  clean(): void {
    this._hash = this.getHash();
  }

  /**
   * Is the hash equal to caluclated hash.
   */
  isHashEqual(): boolean {
    return this._hash === this.getHash();
  }

  /**
   * Calculate hash of this component.
   */
  getHash(): string {
    return objectHash(this.toJSON('simulator'));
  }

  /**
   * Serialize for JSON.
   * @return project object
   */
  toJSON(target: string = 'db'): any {
    // this.hash = objectHash(this.network.toJSON('simulator'));
    const project: any = {
      name: this._name,
      network: this._network.toJSON(target),
      simulation: this._simulation.toJSON(target),
    };
    if (target === 'db') {
      const meta: any = {
        _id: this._id,
        createdAt: this._createdAt,
        description: this._description,
        hash: this._hash,
        updatedAt: this._updatedAt,
        version: this._app.version,
      };
      return { ...project, ...meta };
    } else {
      return project;
    }
  }
}
