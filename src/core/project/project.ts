import { sha1 } from 'object-hash';
import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';

import { Activity } from '../activity/activity';
import { ActivityGraph } from '../activity/activityGraph';
import { AnalogSignalActivity } from '../activity/analogSignalActivity';
import { App } from '../app';
import { Config } from '../config';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { ProjectCode } from './projectCode';
import { ProjectView } from './projectView';
import { Simulation } from '../simulation/simulation';
import { SpikeActivity } from '../activity/spikeActivity';
import { upgradeProject } from './projectUpgrade';

export class Project extends Config {
  private _activityGraph: ActivityGraph;
  private _app: App; // parent
  private _code: ProjectCode; // code script for NEST Server
  private _createdAt: string; // when is it created in database
  private _description: string; // description about the project
  private _errorMessage = '';
  private _hasActivities = false;
  private _hasAnalogActivities = false;
  private _hash: string; // obsolete: hash of serialized network
  private _hasSpatialActivities = false;
  private _hasSpikeActivities = false;
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

    // Upgrade old projects.
    project = upgradeProject(this._app, project);

    // Initialize simulation and network.
    this.initSimulation(project.simulation);
    this.initNetwork(project.network);

    // Initialize code and activity graph.
    this._code = new ProjectCode(this);
    this._activityGraph = new ActivityGraph(this);

    this.clean();
    this.commitNetwork(this._network);
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

  set errorMessage(value: string) {
    this._errorMessage = value;
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
  delete(): Promise<any> {
    return this._app.deleteProject(this._id);
  }

  /**
   * Download this project.
   */
  download(): void {
    this._app.downloadProject(this._id);
  }

  /**
   * Download this project and activities.
   */
  downloadWithActivities(): void {
    this._app.downloadProject(this._id, true);
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
    // console.log('Commit network');

    // Remove networks after the current.
    this._networkRevisions = this._networkRevisions.slice(
      0,
      this._networkRevisionIdx + 1
    );

    // Limit max amount of network revisions;
    const maxRev: number = this.config.maxNetworkRevisions || 5;
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
    if (lastNetwork.codeHash === this._code.hash) {
      currentNetwork = this._networkRevisions.pop();

      // Add activity to recorder nodes
      network.nodes
        .filter(node => node.model.isRecorder())
        .forEach(node => {
          currentNetwork.nodes[node.idx].activity = node.activity.toJSON();
        });
    } else {
      // Get network object
      currentNetwork = network.toJSON();
      currentNetwork.codeHash = this._code.hash; // Copy code hash to current network

      // Add activity to recorder nodes only if hashes is matched.
      if (this._code.hash === this._activityGraph.codeHash) {
        network.nodes
          .filter(node => node.model.isRecorder())
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
    // console.log('Checkout network');

    // Update revision idx.
    if (this._networkRevisionIdx >= this._networkRevisions.length) {
      this._networkRevisionIdx = this._networkRevisions.length - 1;
    }

    // Collect recorder models of old network.
    const oldModels: string[] = this._network.recorders.map(
      (node: Node) => node.modelId
    );

    // Update network.
    const network: any = this._networkRevisions[this._networkRevisionIdx];
    this._network.update(network);

    // Generate simulation code.
    this.code.generate();

    // Collect recorder models of new network.
    const newModels: string[] = this._network.recorders.map(
      (node: Node) => node.modelId
    );

    // Compare recorder models and then update chart graph.
    if (sha1(JSON.stringify(oldModels)) === sha1(JSON.stringify(newModels))) {
      this._activityGraph.activityChartGraph.initPanels();
    } else {
      this._activityGraph.activityChartGraph.init();
    }

    if (this.config.simulateAfterCheckout) {
      // Run simulation.
      setTimeout(() => this.runSimulation(), 1);
    } else {
      // Update activities.
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
   * Start simulation.
   *
   * @remarks
   * After the simulation it updates activities and commit network.
   */
  runSimulation(): Promise<any> {
    // console.log('Run simulation');
    this._errorMessage = '';
    if (this._simulation.kernel.config.autoRNGSeed) {
      this._simulation.kernel.rngSeed = Math.round(Math.random() * 1000);
      this._code.generate();
    }
    this._simulation.running = true;
    return this.app.nestServer.httpClient
      .post(this._app.nestServer.url + '/exec', {
        source: this._code.script,
        return: 'response',
      })
      .then((resp: any) => {
        let data: any;
        switch (resp.status) {
          case 0:
            this._errorMessage = 'Failed to find NEST Server.';
            break;
          case 200:
            data = JSON.parse(resp.response).data;
            this._simulation.kernel.biologicalTime =
              data.kernel.biological_time;
            if (data.positions) {
              data.activities.forEach((activity: any) => {
                const positions = activity.nodeIds.map(
                  (nodeId: number) => data.positions[nodeId]
                );
                activity.nodePositions = positions;
              });
            }
            this.updateActivities(data.activities);
            this.commitNetwork(this._network);
            break;
          default:
            this._errorMessage = resp.response;
            break;
        }

        // Show error message via toast notification.
        if (this._errorMessage) {
          Vue.$toast.open({
            message: this._errorMessage,
            pauseOnHover: true,
            position: 'top-right',
            type: 'error',
          });
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
   * Get a list of analog signal activities.
   */
  get analogSignalActivities(): AnalogSignalActivity[] {
    return this.activities.filter((activity: Activity) =>
      activity.hasAnalogData()
    ) as AnalogSignalActivity[];
  }

  /**
   * Get a list of neuronal analog signal activities.
   */
  get neuronAnalogSignalActivities(): AnalogSignalActivity[] {
    return this.activities.filter((activity: Activity) =>
      activity.hasNeuronAnalogData()
    ) as AnalogSignalActivity[];
  }

  /**
   * Get a list of input analog signal activities.
   */
  get inputAnalogSignalActivities(): AnalogSignalActivity[] {
    return this.activities.filter((activity: Activity) =>
      activity.hasInputAnalogData()
    ) as AnalogSignalActivity[];
  }

  /**
   * Get a list of spike activities.
   */
  get spikeActivities(): SpikeActivity[] {
    return this.activities.filter((activity: Activity) =>
      activity.hasSpikeData()
    ) as SpikeActivity[];
  }

  /**
   * Initialize activity graph.
   */
  initActivityGraph(): void {
    if (this._activityGraph === undefined) {
      return;
    }
    this._activityGraph.init();
    if (this.hasActivities) {
      this._activityGraph.update();
    }
  }

  /**
   * Update activities in recorder nodes after simulation.
   */
  updateActivities(data: any): void {
    // console.log('Update activities');

    // Update recorded activity.
    const activities: Activity[] = this.activities;
    data.forEach((activityData: any, idx: number) => {
      const activity: Activity = activities[idx];
      activity.update(activityData);
    });

    // Check if project has activities.
    this.checkActivities();

    // Update activity graph.
    this._activityGraph.update();
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
    this._hasAnalogActivities =
      activities.length > 0
        ? activities.some((activity: Activity) =>
            activity.hasNeuronAnalogData()
          )
        : false;
    this._hasSpikeActivities =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasSpikeData())
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
   * Does the project have events in analog activities?
   */
  get hasAnalogActivities(): boolean {
    return this._hasAnalogActivities;
  }

  /**
   * Does the project have events in spatial activities?
   */
  get hasSpatialActivities(): boolean {
    return this._hasSpatialActivities;
  }

  /**
   * Does the project have events in spike activities?
   */
  get hasSpikeActivities(): boolean {
    return this._hasSpikeActivities;
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
    const project: any = this.toJSON();
    return sha1(project);
  }

  /**
   * Serialize for JSON.
   * @return project object
   */
  toJSON(): any {
    const project: any = {
      createdAt: this._createdAt,
      description: this._description,
      hash: this._hash,
      id: this._id,
      name: this._name,
      network: this._network.toJSON(),
      simulation: this._simulation.toJSON(),
      updatedAt: this._updatedAt,
      version: this._app.version,
    };
    return project;
  }
}
