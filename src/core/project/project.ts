import { reactive, UnwrapRef } from '@vue/composition-api';
import { sha1 } from 'object-hash';
import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';

import { Activity } from '../activity/activity';
import { ActivityGraph } from '../activity/activityGraph';
import { AnalogSignalActivity } from '../activity/analogSignalActivity';
import { App } from '../app';
import { consoleLog } from '../common/logger';
import { Network } from '../network/network';
import { Node } from '../node/node';
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
  private _name: string; // project name
  private _network: Network; // network of neurons and devices
  private _networkRevisionIdx = -1; // Index of the network history;
  private _networkRevisions: any[] = []; // network history
  private _rev: string; // rev of the project
  private _simulation: Simulation; // settings for the simulation
  private _state: UnwrapRef<any>;
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
    this._state = reactive({
      activityStatsPanelId: 0,
      hasActivities: false,
      hasAnalogActivities: false,
      hash: '',
      hasSpatialActivities: false,
      hasSpikeActivities: false,
      selected: false,
      withActivities: false,
    });

    // Upgrade old projects.
    project = upgradeProject(this._app, project);

    // Initialize simulation and network.
    this.initSimulation(project.simulation);
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

  get state(): UnwrapRef<any> {
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
      setTimeout(() => this.runSimulation(), 1);
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
   * Create a new simulation.
   */
  initSimulation(simulation: any = {}): void {
    this._simulation = new Simulation(this, simulation);
  }

  /**
   * Start simulation.
   *
   * @remarks
   * After the simulation, it updates the activities and commits the network.
   */
  async startSimulation(): Promise<any> {
    return this._simulation.code.runSimulationInsite
      ? this.runSimulationInsite()
      : this.runSimulation();
  }

  /**
   * Start simulation.
   *
   * @remarks
   * After the simulation it updates activities and commit network.
   */
  async runSimulation(): Promise<any> {
    this.consoleLog('Run simulation');
    this.cancelGettingActivityInsite();

    if (this._simulation.code.runSimulationInsite) {
      return;
    }

    // Generate seed and simulation code.
    if (this._simulation.kernel.config.autoRNGSeed) {
      this._simulation.kernel.rngSeed = Math.round(Math.random() * 1000);
      this._simulation.code.generate();
    }

    this._simulation.resetState();
    this.resetActivities();
    this._simulation.running = true;
    return this.app.backends.nestSimulator.instance
      .post('exec', {
        source: this._simulation.code.script,
        return: 'response',
      })
      .then((response: any) => {
        let data: any;
        switch (response.status) {
          case 0:
            this.openToast('Failed to find NEST Simulator.', 'error');
            break;
          case 200:
            if (response.data.data != null) {
              data = response.data.data;
              // get biological time
              this._simulation.state.biologicalTime =
                data.kernel != null
                  ? data.kernel.biological_time
                  : this._simulation.time;

              // get activities
              if (data.activities != null) {
                // get positions
                if (data.positions != null) {
                  data.activities.forEach((activity: any) => {
                    const positions = activity.nodeIds.map(
                      (nodeId: number) => data.positions[nodeId]
                    );
                    activity.nodePositions = positions;
                  });
                }

                // initialize activities
                this.initActivities(data.activities);
              }
            }

            // commit network for history
            this.commitNetwork(this._network);
            break;
          default:
            this.openToast(response.data, 'error');
            break;
        }
        return response;
      })
      .catch((error: any) => {
        if (error.response) {
          // Request made and server responded.
          this.openToast(error.response.data, 'error');
        } else if (error.request) {
          // The request was made but no response was received.
          this.openToast('Failed to find NEST Simulator.', 'error');
        } else {
          // Something happened in setting up the request
          // that triggered an error.
          this.openToast(error.message, 'error');
        }
      })
      .finally(() => {
        this._simulation.running = false;
      });
  }

  /**
   * Start simulation with recording backend Insite.
   *
   * @remarks
   * During the simulation it gets and updates activities.
   */
  runSimulationInsite(): void {
    this.consoleLog('Run simulation with Insite');

    this.cancelGettingActivityInsite();

    if (!this._simulation.code.runSimulationInsite) {
      return;
    }

    this._app.project.view.state.fromTime = 0;

    // Generate seed and simulation code.
    if (this._simulation.kernel.config.autoRNGSeed) {
      this._simulation.kernel.rngSeed = Math.round(Math.random() * 1000);
      this._simulation.code.generate();
    }

    this._simulation.resetState();
    this.resetActivities();
    this._simulation.state.biologicalTime = this._simulation.time;
    this._simulation.running = true;
    this._app.backends.nestSimulator.instance
      .post('exec', { source: this._simulation.code.script })
      .then((response: any) => {
        switch (response.status) {
          case 0:
            this.openToast('Failed to find NEST Simulator.', 'error');
            this.cancelGettingActivityInsite();
            break;
          case 200:
            this._app.backends.insiteAccess.instance
              .get('nest/simulationTimeInfo/')
              .then((response: any) => {
                this.openToast('Simulation is finished.', 'success');
                this._simulation.running =
                  response.data.end >
                  response.data.current + response.data.stepSize;
              });
            break;
          default:
            this.openToast(response.responseText, 'error');
            this.cancelGettingActivityInsite();
            break;
        }
        return response;
      })
      .catch((error: any) => {
        this.cancelGettingActivityInsite();
        this.openToast(error.response.data, 'error');
        return error;
      })
      .finally(() => {
        this._simulation.running = false;
      });

    // TODO: Find better solution for fetching activities.
    setTimeout(() => this.getActivitiesInsite(), 100);
  }

  /**
   * Get activities from Insite.
   *
   * First it checks the simulation has started,
   * then it updates activity graph frequently.
   * Afterwards it gets activities from Insite.
   */
  getActivitiesInsite(): void {
    this.consoleLog('Get activites from Insite');
    this._app.backends.insiteAccess.instance
      .get('nest/simulationTimeInfo/')
      .catch(() => {
        setTimeout(() => this.getActivitiesInsite(), 100);
      })
      .then((response: any) => {
        if (response == null) {
          return;
        }
        this._simulation.state.timeInfo = response.data;

        // Update activity graph during the simulation.
        this.continuouslyUpdateActivityGraph();

        const positions: any = {};
        this._app.backends.insiteAccess.instance
          .get('nest/nodes/')
          .then((response: any) => {
            response.data.forEach((data: any) => {
              if (data.position != null) {
                positions[data.nodeId] = data.position;
              }
            });

            // Check if project has activities.
            this.checkActivities();

            if (this._state.hasSpikeActivities) {
              this.getSpikeActivitiesInsite(positions);
            }

            if (this._state.hasAnalogActivities) {
              this.getAnalogSignalActivitiesInsite(positions);
            }
          });
      });
  }

  /**
   * Cancel getting activities from Insite.
   *
   * When NEST Server responds error.
   * TODO: Check if it is working properly.
   */
  cancelGettingActivityInsite(): void {
    this.activities.forEach(
      (activity: Activity) => (activity.lastFrame = true)
    );
  }

  /**
   * Get spike activities from Insite.
   */
  getSpikeActivitiesInsite(positions: any): void {
    this.consoleLog('Get spike activities from Insite');
    this._app.backends.insiteAccess.instance
      .get('nest/spikerecorders/')
      .then((response: any) => {
        const activities: any[] = response.data.map((data: any) => {
          const nodePositions: number[][] = [];
          if (Object.keys(positions).length > 0) {
            data.nodeIds.forEach((id: number) => {
              if (id in positions) {
                nodePositions.push(positions[id]);
              }
            });
          }
          const activity: any = {
            nodeCollectionId: data.spikerecorderId,
            nodeIds: data.nodeIds,
            nodePositions,
          };

          return activity;
        });

        // Initialize activities.
        this.initActivities(activities);

        // Get spike activities from spike recorders.
        this.spikeActivities.forEach((activity: SpikeActivity) =>
          activity.getActivityInsite()
        );
      });
  }

  /**
   * Get analog signal activities from Insite.
   */
  getAnalogSignalActivitiesInsite(positions: any): void {
    this.consoleLog('Get analog signal activities from Insite');
    this._app.backends.insiteAccess.instance
      .get('nest/multimeters/')
      .then((response: any) => {
        const activities: any[] = response.data.map((data: any) => {
          const events = { times: [], senders: [] };
          data.attributes.forEach((attribute: string) => {
            events[attribute] = [];
          });

          const nodePositions: number[][] = [];
          if (Object.keys(positions).length > 0) {
            data.nodeIds.forEach((id: number) => {
              if (id in positions) {
                nodePositions.push(positions[id]);
              }
            });
          }

          const activity: any = {
            events,
            nodeCollectionId: data.multimeterId,
            nodeIds: data.nodeIds,
            nodePositions,
          };

          return activity;
        });

        // Initialize activities.
        this.initActivities(activities);

        // Get analog signal activities from multimeters.
        this.analogSignalActivities.forEach((activity: AnalogSignalActivity) =>
          activity.getActivityInsite()
        );
      });
  }

  /**
   * Update activity graph continuously.
   */
  continuouslyUpdateActivityGraph(): void {
    this.consoleLog('Update activity graph continuously');
    this._app.project.view.state.refreshIntervalId = setInterval(() => {
      // Check if project has activities.
      this.checkActivities();

      // Update activity graph.
      this._activityGraph.update();

      const lastFrames: boolean = this.activities.every(
        (activity: Activity) => activity.lastFrame
      );
      if (lastFrames) {
        clearInterval(this._app.project.view.state.refreshIntervalId);
      }

      // TODO:
      // Find better algoritm for stop updating activity graph,
      // e.g. recursive call in timeout
    }, 1000);
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
      (activity: Activity) => activity.hasAnalogData
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
      (activity: Activity) => activity.hasSpikeData
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
    if (this._state.hasActivities) {
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
    this.checkActivities();

    // Update activity graph.
    this._activityGraph.update();
  }

  /**
   * Initialize activities in recorder nodes after simulation.
   */
  initActivities(data: any[]): void {
    // Initialize recorded activities.
    this.activities.forEach((activity: Activity, idx: number) => {
      activity.init(data[idx]);
    });

    // Check if project has activities.
    this.checkActivities();

    // Update activity graph.
    this._activityGraph.update();
  }

  /**
   * Update activities in recorder nodes after simulation.
   */
  // updateActivities(data: any[]): void {
  //   // Update recorded activities.
  //   this.activities.forEach((activity: Activity, idx: number) => {
  //     activity.update(data[idx]);
  //   });
  //
  //   // Check if project has activities.
  //   this.checkActivities();
  //
  //   // Update activity graph.
  //   this._activityGraph.update();
  // }

  /**
   * Check whether the project has some events in activities.
   */
  checkActivities(): void {
    const activities: Activity[] = this.activities;

    // Check if it has activities.
    this._state.hasActivities =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasEvents)
        : false;

    // Check if it has analog signal activities.
    this._state.hasAnalogActivities =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasAnalogData)
        : false;

    // Check if it has spike activities.
    this._state.hasSpikeActivities =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasSpikeData)
        : false;

    // Check if it has spatial activities.
    this._state.hasSpatialActivities = this._state.hasActivities
      ? activities.some(
          (activity: Activity) =>
            activity.hasEvents && activity.nodePositions.length > 0
        )
      : false;
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
    this.updateHash();
  }

  /**
   * Reset state of this project.
   */
  resetState(): void {
    this._state.selected = false;
    this._state.withActivities = false;
  }

  /**
   * Open toast of message from the back end
   */
  openToast(message: string, type: string = 'success') {
    this._app.project.view.state.toast.message = message;
    this._app.project.view.state.toast.type = type;

    // Show NEST or Python error message via toast notification.
    if (this._app.project.view.state.toast.message) {
      Vue.$toast.open(this._app.project.view.state.toast);
    }
  }

  /**
   * Calculate hash of this component.
   */
  updateHash(): void {
    this._state.hash = sha1({
      description: this._description,
      name: this._name,
      network: this._network.toJSON(),
      simulation: this._simulation.toJSON(),
    });
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
