import { v4 as uuidv4 } from 'uuid';

import { Activity } from '../activity/activity';
import { ActivityGraph } from '../activity/activityGraph';
import { AnalogSignalActivity } from '../activity/analogSignalActivity';
import { App } from '../app';
import { consoleLog } from '../common/logger';
import { Insite } from './insite/insite';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { ProjectState } from './projectState';
import { Simulation } from '../simulation/simulation';
import { SpikeActivity } from '../activity/spikeActivity';
import { upgradeProject } from './projectUpgrade';

export class Project {
  private _activityGraph: ActivityGraph;
  private _app: App; // parent
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _doc: any; // doc data of the database
  private _id: string; // id of the project
  private _insite: Insite; // insite
  private _name: string; // project name
  private _network: Network; // network of neurons and devices
  private _networkRevisionIdx = -1; // Index of the network history;
  private _networkRevisions: any[] = []; // network history
  private _rev: string; // rev of the project
  private _simulation: Simulation; // settings for the simulation
  private _state: ProjectState;
  private _updatedAt: string; // when is it updated in database

  constructor(app: App, project: any = {}) {
    this._app = app;

    // Database instance
    this._doc = project || {};
    this._id = project.id || uuidv4();
    this._rev = project._rev || '';
    this._createdAt = project.createdAt || new Date();
    this._updatedAt = project.updatedAt;

    // Project metadata
    this._name = project.name || '';
    this._description = project.description || '';

    // Initialize project state.
    this._state = new ProjectState(this);
    this._insite = new Insite(this);

    // Upgrade old projects.
    project = upgradeProject(this._app, project);

    // Initialize simulation and network.
    this._simulation = new Simulation(this, project.simulation);
    this.initNetwork(project.network);

    // Initialize activity graph.
    this._activityGraph = new ActivityGraph(this, project.activityGraph);

    this.clean();
  }

  get activityGraph(): ActivityGraph {
    return this._activityGraph;
  }

  get app(): App {
    return this._app;
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

  /**
   * Returns the first six digits of the project ID.
   * @returns 6-digit hash value
   */
  get shortId(): string {
    return this._id ? this._id.slice(0, 6) : '';
  }

  get state(): ProjectState {
    return this._state;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 4);
  }

  /**
   * Is the current project selected?
   */
  get isSelected(): boolean {
    return this._id === this._app.project.view.state.project.id;
  }

  /**
   * Save the current project.
   */
  async save(): Promise<any> {
    return this._app.project.importProject(this);
  }

  /**
   * Initialize project.
   */
  init(options: any = { generateCode: true }): void {
    this.clean();

    if (options.generateCode) {
      this._simulation.code.generate();
    }
    // Reset network graph.
    this._network.state.reset();

    // Commit network in history.
    this.commitNetwork(this._network);
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
    const newProject: Project = this.clone();
    this._app.project.state.projects.unshift(newProject);
    return newProject;
  }

  /**
   * Delete this project from the list and database.
   */
  async delete(): Promise<any> {
    return this._app.project.deleteProject(this);
  }

  /**
   * Export this project.
   */
  export(): void {
    this._app.project.exportProject(this._id);
  }

  /**
   * Export this project and activities.
   */
  exportWithActivities(): void {
    this._app.project.exportProject(this._id, true);
  }

  /**
   * Reload this project.
   */
  async reload(): Promise<any> {
    return this._app.project.reloadProject(this);
  }

  /*
   * Project revisions
   */

  /**
   * Is this revised project selected?
   */
  get isRevisionSelected(): boolean {
    return this._rev === this._app.project.view.state.project.rev;
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
    this.consoleLog('Commit network of ' + network.project.shortId);

    // Remove networks after the current.
    this._networkRevisions = this._networkRevisions.slice(
      0,
      this._networkRevisionIdx + 1
    );

    // Limit max amount of network revisions.
    const maxRev: number = this._app.project.view
      ? this._app.project.view.config.maxNetworkRevisions
      : 5;
    if (this._networkRevisions.length > maxRev) {
      this._networkRevisions = this._networkRevisions.slice(
        this._networkRevisions.length - maxRev
      );
    }

    // Get last network of the revisions.
    const lastNetwork: any =
      this._networkRevisions.length > 0
        ? this._networkRevisions[this._networkRevisions.length - 1]
        : {};

    let currentNetwork: any;
    if (
      lastNetwork.codeHash != null &&
      lastNetwork.codeHash === this._simulation.code.hash
    ) {
      currentNetwork = this._networkRevisions.pop();

      // Add activity to recorder nodes.
      network.nodes
        .filter(node => node.model.isRecorder)
        .forEach(node => {
          currentNetwork.nodes[node.idx].activity = node.activity.toJSON();
        });
    } else {
      // Get network object.
      currentNetwork = network.toJSON();
      // Copy code hash to current network.
      currentNetwork.codeHash = this._simulation.code.hash;

      // Add activity to recorder nodes only if hashes is matched.
      if (this._simulation.code.hash === this._activityGraph.codeHash) {
        network.nodes
          .filter(node => node.model.isRecorder)
          .forEach(node => {
            currentNetwork.nodes[node.idx].activity = node.activity.toJSON();
          });
      }
    }

    // Push current network to the revisions.
    this._networkRevisions.push(currentNetwork);

    // Update idx of the latest network revision.
    this._networkRevisionIdx = this._networkRevisions.length - 1;
  }

  /**
   * Load network from the history list.
   *
   * @remarks It generates code.
   */
  checkoutNetwork(): void {
    this.consoleLog('Checkout network');

    // Update revision idx.
    if (this._networkRevisionIdx >= this._networkRevisions.length) {
      this._networkRevisionIdx = this._networkRevisions.length - 1;
    }

    // Update network.
    const network: any = this._networkRevisions[this._networkRevisionIdx];
    this._network.update(network);

    // Generate simulation code.
    this._simulation.code.generate();

    // Initialize activity graph.
    // It resets always the panels.
    // TODO: Better solution to update activity graph.
    this._activityGraph.init();

    if (this._app.project.view.config.simulateAfterCheckout) {
      // Run simulation.
      setTimeout(() => this.startSimulation(), 1);
    } else {
      // Update activities.
      const activities: any[] = this.activities.map((activity: Activity) =>
        activity.toJSON()
      );
      this.initActivities(activities);
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
   * Start simulation.
   */
  startSimulation(): void {
    // Stop getting activities from Insite.
    this.insite.cancelGettingActivity();

    // Reset activities and activity graphs.
    this.resetActivities();

    this._simulation.start().then((response: any) => {
      if (
        response == null ||
        response.status != 200 ||
        response.data == null ||
        response.data.hasOwnProperty('data')
      ) {
        return;
      }

      // Initialize activities
      this.initActivities(response.data.data);

      // Commit network for the history.
      this.commitNetwork(this.network);
    });

    if (this._simulation.code.runSimulationInsite) {
      // Get activities from Insite Access Node.
      this.insite.getActivities();
    }
  }

  /*
   * Activities
   */

  /**
   * Get a list of activities.
   */
  get activities(): Activity[] {
    this.consoleLog('Get activities');
    const activities: Activity[] = this._network
      ? this._network.recorders.map((recorder: Node) => recorder.activity)
      : [];
    activities.forEach((activity: Activity, idx: number) => {
      activity.idx = idx;
    });
    return activities;
  }

  /**
   * Get a list of analog signal activities.
   */
  get analogSignalActivities(): AnalogSignalActivity[] {
    return this.activities.filter(
      (activity: Activity) => activity.recorder.model.isAnalogRecorder
    ) as AnalogSignalActivity[];
  }

  /**
   * Get a list of neuronal analog signal activities.
   */
  get neuronAnalogSignalActivities(): AnalogSignalActivity[] {
    return this.activities.filter(
      (activity: Activity) => activity.hasNeuronAnalogData
    ) as AnalogSignalActivity[];
  }

  /**
   * Get a list of input analog signal activities.
   */
  get inputAnalogSignalActivities(): AnalogSignalActivity[] {
    return this.activities.filter(
      (activity: Activity) => activity.hasInputAnalogData
    ) as AnalogSignalActivity[];
  }

  /**
   * Get a list of spike activities.
   */
  get spikeActivities(): SpikeActivity[] {
    return this.activities.filter(
      (activity: Activity) => activity.recorder.model.isSpikeRecorder
    ) as SpikeActivity[];
  }

  /**
   * Initialize activity graph.
   */
  initActivityGraph(): void {
    this.consoleLog('Initialize activity graph of ' + this._name);
    if (this._activityGraph == undefined) {
      return;
    }

    this._activityGraph.init();

    if (this._state.activities.hasSomeEvents) {
      this._activityGraph.update();
    }
  }

  /**
   * Reset activities.
   */
  resetActivities(): void {
    // Reset activities.
    this.activities.forEach((activity: Activity) => {
      activity.reset();
    });

    // Check if project has activities.
    this._state.checkActivities();

    // Update activity graph.
    this._activityGraph.update();
  }

  /**
   * Initialize activities in recorder nodes after simulation.
   */
  initActivities(data: any): void {
    let activities: any[] = [];

    if (data.hasOwnProperty('activities')) {
      activities = data.activities;
    } else if (data.hasOwnProperty('events')) {
      activities = data.events.map((events: any) => ({
        events,
      }));
    } else {
      activities = data;
    }

    activities.forEach((activity: any) => {
      if (!activity.hasOwnProperty('nodeIds')) {
        if (activity.events.hasOwnProperty('ports')) {
          activity.nodeIds = activity.events.ports.filter(
            (value: number, index: number, self: number[]) =>
              self.indexOf(value) === index
          );
        } else {
          activity.nodeIds = activity.events.senders.filter(
            (value: number, index: number, self: number[]) =>
              self.indexOf(value) === index
          );
        }
      }
      activity.nodeIds.sort((a: number, b: number) => a - b);
    });

    // Get node positions.
    if (data.hasOwnProperty('positions')) {
      activities.forEach((activity: any) => {
        activity.nodePositions = activity.nodeIds.map(
          (nodeId: number) => data.positions[nodeId]
        );
      });
    }

    // Initialize recorded activities.
    this.activities.forEach((activity: Activity, idx: number) => {
      activity.init(activities[idx]);
    });

    // Check if project has activities.
    this._state.checkActivities();

    // Update activity graph.
    this._activityGraph.update();
  }

  /**
   * Serialization
   */

  /**
   * Clean project.
   *
   * @remarks
   * Clean project code.
   * Update hash of this project.
   */
  clean(): void {
    this._simulation.code.clean();
    this._state.updateHash();
  }

  /**
   * Serialize for JSON.
   * @return project object
   */
  toJSON(): any {
    const project: any = {
      activityGraph: this._activityGraph.toJSON(),
      createdAt: this._createdAt,
      description: this._description,
      id: this._id,
      name: this._name,
      network: this._network.toJSON(),
      simulation: this._simulation.toJSON(),
      updatedAt: this._updatedAt,
      version: this._app.state.version,
    };
    return project;
  }
}
