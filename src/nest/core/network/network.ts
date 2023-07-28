// network.ts

import { ILogObj, Logger } from "tslog";

import { Config } from "@/helpers/config";
import { logger as mainLogger } from "@/utils/logger";

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
  private _logger: Logger<ILogObj>;
  private _models: CopyModels; // for nest.CopyModel
  private _nodes: Nodes; // for nest.Create
  private _project: Project; // project
  private _state: NetworkState; // network state
  private _revisionIdx = -1; // Index of the network history;
  private _revisions: any[] = []; // network history
  // private _graph: NetworkGraph;

  constructor(project: Project, network: NetworkProps = {}) {
    super("Network");
    this._project = project;

    this._models = new CopyModels(this, network.models);
    this._nodes = new Nodes(this, network.nodes);
    this._connections = new Connections(this, network.connections);

    // this._graph = new NetworkGraph(this);
    this._state = new NetworkState(this);
    this._logger = mainLogger.getSubLogger({
      name: `network`,
    });

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

  // get graph(): NetworkGraph {
  //   return this._graph;
  // }

  get isEmpty(): boolean {
    return (
      this._models.all.length === 0 &&
      this._nodes.all.length === 0 &&
      this._connections.all.length === 0
    );
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
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
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It commits the network in the network history.
   * It emits project changes.
   */
  changes(): void {
    this._state.updateHash();
    // this.commit();
    this._logger.trace("changes");
    this._project.changes();
  }

  /**
   * Load network from the history list.
   *
   * @remarks It generates code.
   */
  checkout(): void {
    this._logger.trace("checkout");

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
    // this._project.initActivityGraph();

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
    this._logger.trace("clean");
    this._nodes.clean();
    this._connections.clean();
    this._models.clean();

    this._nodes.updateRecords();
    this.updateStates();
  }

  /**
   * Clear the network.
   */
  clear(): void {
    this._logger.trace("clear");
    this._connections.clear();
    this._nodes.clear();
    this._models.clear();

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
    this._logger.trace("commit");

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
          currentNetwork.nodes[node.idx].activity = node.activity?.toJSON();
        });
    } else {
      // Get network object.
      currentNetwork = this.toJSON();
      // Copy code hash to current network.
      currentNetwork.codeHash = this._project.simulation.code.state.hash;

      // Add activity to recorder nodes only if hashes is matched.
      // if (
      //   this._project.simulation.code.state.hash ===
      //   this._project.activityGraph.codeHash
      // ) {
      this.nodes.all
        .filter((node: Node) => node.model.isRecorder)
        .forEach((node: Node) => {
          currentNetwork.nodes[node.idx].activity = node.activity?.toJSON();
        });
      // }
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
    this._logger.trace("connect nodes");

    const connection: Connection = this._connections.add({
      source: source.idx,
      target: target.idx,
    });

    if (source.view.state.synWeights) {
      connection.synapse.weightLabel = source.view.state.synWeights;
    }

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.initActivity();
      // this._project.initActivityGraph();
    }
  }

  /**
   * Create node component by user interaction.
   */
  createNode(view: any): void {
    this._logger.trace("create node");

    const defaultModels: { [key: string]: string } = {
      neuron: "iaf_psc_alpha",
      recorder: "voltmeter",
      stimulator: "dc_generator",
    };

    this._nodes.add({
      model: defaultModels[view.elementType],
      view: view,
    });

    this.changes();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteConnection(connection: Connection): void {
    this._logger.trace("delete connection");

    // Remove connection from the list.
    this._connections.remove(connection);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this._project.initActivityGraph();
  }

  /**
   * Delete model component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteModel(model: CopyModel): void {
    this._logger.trace("delete copy model");

    // Remove model from the list.
    this._models.remove(model);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this._project.initActivityGraph();
  }

  /**
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: Node): void {
    this._logger.trace("delete node");

    // Remove connection from the list.
    this._connections.removeByNode(node);

    // Remove node from the list.
    this._nodes.remove(node);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this._project.initActivityGraph();
  }

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config.color.cycle;
    return colors[idx % colors.length];
  }

  init(): void {
    this._logger.trace("init");
    this.clearNetworkHistory();
    this._nodes.updateRecords();
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
    this._logger.trace("update");
    this._models.update(network.models);
    this._nodes.update(network.nodes);
    this._connections.update(network.connections);

    // Update states.
    this.updateStates();
  }

  updateStates(): void {
    this._nodes.updateStates();
    this._connections.updateStates();
    this._state.updateHash();
  }
}
