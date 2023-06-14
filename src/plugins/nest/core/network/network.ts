// network.ts

import { Config } from "@/helpers/config";

import { Connection, ConnectionProps } from "../connection/connection";
import { Connections } from "../connection/connections";
import { CopyModel, CopyModelProps } from "../model/copyModel";
import { CopyModels } from "../model/copyModels";
import { NetworkState } from "./networkState";
import { Node, NodeProps } from "../node/node";
import { Nodes } from "../node/nodes";
import { Project } from "../project/project";
import { Activity } from "../activity/activity";

export interface NetworkProps {
  models?: CopyModelProps[];
  nodes?: NodeProps[];
  connections?: ConnectionProps[];
}

export class Network extends Config {
  private _connections: Connections; // for nest.Connect
  private _models: CopyModels; // for nest.CopyModel
  private _nodes: Nodes; // for nest.Create
  private _project: Project; // project
  private _state: NetworkState; // network state
  private _revisionIdx = -1; // Index of the network history;
  private _revisions: any[] = []; // network history

  constructor(project: Project, network: NetworkProps = {}) {
    super("Network");
    this._project = project;

    this._models = new CopyModels(this, network.models);
    this._nodes = new Nodes(this, network.nodes);
    this._connections = new Connections(this, network.connections);

    this._state = new NetworkState(this);
    this.updateStates();

    this.init();
  }

  get colors(): string[] {
    return this.config.color.cycle;
  }

  set colors(value: string[]) {
    const color: any = this.config.color;
    color.cycle = value;
    this.config.update({ color });
  }

  get connections(): Connections {
    return this._connections;
  }

  /**
   * Get copied models
   */
  get models(): CopyModels {
    return this._models;
  }

  /**
   * Get nodes
   */
  get nodes(): Nodes {
    return this._nodes;
  }

  get project(): Project {
    return this._project;
  }

  /**
   * Get revision index of the network history.
   */
  get revisionIdx(): number {
    return this._revisionIdx;
  }

  /**
   * Get list of network history.
   */
  get revisions(): any[] {
    return this._revisions;
  }

  get state(): NetworkState {
    return this._state;
  }

  /**
   * Load network from the history list.
   *
   * @remarks It generates code.
   */
  checkout(): void {
    console.debug("Checkout network");

    // Update revision idx.
    if (this._revisionIdx >= this._revisions.length) {
      this._revisionIdx = this._revisions.length - 1;
    }

    // Update network.
    const network: any = this._revisions[this._revisionIdx];
    this.update(network);

    // Generate simulation code.
    this._project.simulation.code.generate();

    // Initialize activity graph.
    // It resets always the panels.
    // TODO: Better solution to update activity graph.
    this._project.activityGraph.init();

    if (this._project.simulateAfterCheckout) {
      // Run simulation.
      setTimeout(() => this._project.startSimulation(), 1);
    } else {
      // Update activities.
      const activities: any[] = this._project.activities.all.map(
        (activity: Activity) => activity.toJSON()
      );
      this._project.activities.update(activities);
    }

    this.clean();
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._nodes.clean();
    this._connections.clean();
    this._models.clean();

    this.updateStates();
  }

  /**
   * Clear network history list.
   */
  clearNetworkHistory(): void {
    this._revisions = [];
    this._revisionIdx = -1;
  }

  /**
   * Clone network component.
   */
  clone(): Network {
    return new Network(this._project, { ...this.toJSON() });
  }

  /**
   * Add network to the history list.
   */
  commit(): void {
    console.debug("Commit network of " + this._project.shortId);

    // Remove networks after the current.
    this._revisions = this._revisions.slice(0, this._revisionIdx + 1);

    // Limit max amount of network revisions.
    const maxRev: number = 5;
    if (this._revisions.length > maxRev) {
      this._revisions = this._revisions.slice(this._revisions.length - maxRev);
    }

    // Get last network of the revisions.
    const lastNetwork: any =
      this._revisions.length > 0
        ? this._revisions[this._revisions.length - 1]
        : {};

    let currentNetwork: any;
    if (
      lastNetwork.codeHash != null &&
      lastNetwork.codeHash === this._project.simulation.code.state.hash
    ) {
      currentNetwork = this._revisions.pop();

      // Add activity to recorder nodes.
      this.nodes.all
        .filter((node) => node.model.isRecorder)
        .forEach((node) => {
          currentNetwork.nodes[node.idx].activity = node.activity.toJSON();
        });
    } else {
      // Get network object.
      currentNetwork = this.toJSON();
      // Copy code hash to current network.
      currentNetwork.codeHash = this._project.simulation.code.state.hash;

      // Add activity to recorder nodes only if hashes is matched.
      if (
        this._project.simulation.code.state.hash ===
        this._project.activityGraph.codeHash
      ) {
        this.nodes.all
          .filter((node: Node) => node.model.isRecorder)
          .forEach((node: Node) => {
            currentNetwork.nodes[node.idx].activity = node.activity.toJSON();
          });
      }
    }

    // Push current network to the revisions.
    this._revisions.push(currentNetwork);

    // Update idx of the latest network revision.
    this._revisionIdx = this._revisions.length - 1;
  }

  /**
   * Connect node components by user interaction.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  connectNodes(source: Node, target: Node): void {
    // console.log("Connect nodes");

    const connection: Connection = this._connections.add({
      source: source.idx,
      target: target.idx,
    });

    const weight: string = source.view.weight;
    if (weight === "inhibitory") {
      source.setWeights(weight);
    }

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.initActivity();
      this._project.initActivityGraph();
    }
  }

  /**
   * Create node component by user interaction.
   */
  createNode(view: any): void {
    // console.log("Create node");

    const defaultModels: { [key: string]: string } = {
      neuron: "iaf_psc_alpha",
      recorder: "voltmeter",
      stimulator: "dc_generator",
    };

    this._nodes.add({
      model: defaultModels[view.elementType],
      view: view,
    });

    this.networkChanges();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteConnection(connection: Connection): void {
    // console.log("Delete connection");

    // Remove connection from the list.
    this._connections.remove(connection);

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteModel(model: CopyModel): void {
    // console.log("Delete model");

    // Remove model from the list.
    this._models.remove(model);

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: Node): void {
    // console.log("Delete node");

    // Remove connection from the list.
    this._connections.removeByNode(node);

    // Remove node from the list.
    this._nodes.remove(node);

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Clear the network.
   */
  empty(): void {
    this._connections.empty();
    this._nodes.empty();
    this._models.empty();

    this.updateStates();
  }

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config.color.cycle;
    return colors[idx % colors.length];
  }

  init(): void {
    this.clearNetworkHistory();
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates simulation code in the code editor.
   * It commits the network in the network history.
   */
  networkChanges(): void {
    // console.log("Network changes");

    this.updateStates();

    this._project.simulation.code.generate();

    this._project.state.updateHash();

    // this._project.commitNetwork(this);

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    // const projectView = this._project.app.project.view;
    // if (
    //   projectView.config.simulateAfterChange &&
    //   projectView.state.modeIdx === 1
    // ) {
    //   setTimeout(() => this._project.startSimulation(), 1);
    // }

    this._project.state.checkChanges();
  }

  /**
   * Go to the newer network.
   */
  newer(): void {
    if (this._revisionIdx < this._revisions.length) {
      this._revisionIdx++;
    }
    this.checkout();
  }

  /**
   * Go to the newest network.
   */
  newest(): void {
    this._revisionIdx = this._revisions.length - 1;
    this.checkout();
  }

  /**
   * Go to the older network.
   */
  older(): void {
    if (this._revisionIdx > 0) {
      this._revisionIdx--;
    }
    this.checkout();
  }

  /**
   * Go to the oldest network.
   */
  oldest(): void {
    this._revisionIdx = 0;
    this.checkout();
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(): NetworkProps {
    return {
      connections: this._connections.toJSON(),
      models: this._models.toJSON(),
      nodes: this._nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  update(network: NetworkProps): void {
    this._models.update(network.models);
    this._nodes.update(network.nodes);
    this._connections.update(network.connections);

    this.updateStates();
  }

  updateStates(): void {
    this._nodes.updateStates();
    this._connections.updateStates();
    this._state.update();
  }
}
