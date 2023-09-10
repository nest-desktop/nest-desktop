// baseNetwork.ts

import { ILogObj, Logger } from "tslog";

import { Activity } from "@/helpers/activity/activity";
import { BaseConnection, ConnectionProps } from "@/helpers/connection/baseConnection";
import { BaseConnections } from "@/helpers/connection/baseConnections";
import { BaseNodes } from "@/helpers/node/baseNodes";
import { Config } from "@/helpers/config";
import { Connection } from "@/types/connectionTypes";
import { Connections } from "@/types/connectionsTypes";
import { Network } from "@/types/networkTypes";
import { Node } from "@/types/nodeTypes";
import { NodeProps } from "@/helpers/node/baseNode";
import { Nodes } from "@/types/nodesTypes";
import { Project } from "@/types/projectTypes";
import { logger as mainLogger } from "@/helpers/common/logger";

import { BaseNetworkState } from "./baseNetworkState";

export interface NetworkProps {
  nodes?: NodeProps[];
  connections?: ConnectionProps[];
}

export class BaseNetwork extends Config {
  private _logger: Logger<ILogObj>;
  private _revisionIdx = -1; // Index of the network history;
  private _revisions: any[] = []; // network history
  private _state: BaseNetworkState; // network state

  public _connections: Connections;
  public _nodes: Nodes;
  public _project: Project; // parent
  // private _graph: NetworkGraph;

  private _defaultModels: { [key: string]: string } = {
    neuron: "iaf_psc_alpha",
    recorder: "voltmeter",
    stimulator: "dc_generator",
  };

  constructor(
    project: Project,
    network: NetworkProps = {},
  ) {
    super("Network");

    // this._graph = new NetworkGraph(this);
    this._logger = mainLogger.getSubLogger({
      name: "network",
    });

    this._state = new BaseNetworkState(this);
    this._project = project;

    this._nodes = this.newNodes(network.nodes);
    this._connections = this.newConnections(network.connections);

    this.updateStates();

    this.clearNetworkHistory();
    this.nodes.updateRecords();
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

  set defaultModels(value: any) {
    this._defaultModels = value;
  }

  // get graph(): NetworkGraph {
  //   return this._graph;
  // }

  get isEmpty(): boolean {
    return this.nodes.all.length === 0 && this.connections.all.length === 0;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
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

  get state(): BaseNetworkState {
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
    this.commit();
    this._logger.trace("changes");
    this.project.changes();
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
    this.project.simulation.code.generate();

    // Initialize activity graph.
    // It resets always the panels.
    // TODO: Better solution to update activity graph.
    // this.project.initActivityGraph();

    if (this.project?.simulateAfterCheckout) {
      // Run simulation.
      setTimeout(() => this.project.startSimulation(), 1);
    } else {
      // Update activities.
      const activities: any[] | undefined = this.project.activities.all.map(
        (activity: Activity) => activity.toJSON()
      );
      if (activities) {
        this.project.activities.update(activities);
      }
    }

    this.clean();
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._logger.trace("clean");
    this.nodes.clean();
    this.connections.clean();

    this.nodes.updateRecords();
    this.updateStates();
  }

  /**
   * Clear the network.
   */
  clear(): void {
    this._logger.trace("clear");
    this.connections.clear();
    this.nodes.clear();

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
   * Clone base network component.
   */
  clone(): Network {
    return new BaseNetwork(this.project, { ...this.toJSON() });
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
      lastNetwork.codeHash === this.project.simulation.code.state.hash
    ) {
      currentNetwork = this._revisions.pop();

      // Add activity to recorder nodes.
      this.nodes.all
        .filter((node: Node) => node.model.isRecorder)
        .forEach((node: Node) => {
          currentNetwork.nodes[node.idx].activity = node.activity?.toJSON();
        });
    } else {
      // Get network object.
      currentNetwork = this.toJSON();
      // Copy code hash to current network.
      currentNetwork.codeHash = this.project.simulation.code.state.hash;

      // Add activity to recorder nodes only if hashes is matched.
      // if (
      //   this.project.simulation.code.state.hash ===
      //   this.project.activityGraph.codeHash
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

    const connection: Connection | undefined = this.connections.add({
      source: source.idx,
      target: target.idx,
    });

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.initActivity();
      // this.project.initActivityGraph();
    }
  }

  /**
   * Create node component by user interaction.
   */
  createNode(view: any): void {
    this._logger.trace("create node");

    this.nodes?.add({
      model: this._defaultModels[view.elementType],
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
  deleteConnection(connection: BaseConnection): void {
    this._logger.trace("delete connection");

    // Remove connection from the list.
    this.connections.remove(connection);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this.project.initActivityGraph();
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
    this.connections.removeByNode(node);

    // Remove node from the list.
    this.nodes.remove(node);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this.project.initActivityGraph();
  }

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config.color.cycle;
    return colors[idx % colors.length];
  }

  /**
   * New nodes component.
   */
  newNodes(data?: NodeProps[] | undefined): BaseNodes {
    return new BaseNodes(this, data);
  }

  /**
   * New components component.
   */
  newConnections(data: ConnectionProps[] | undefined): BaseConnections {
    return new BaseConnections(this, data);
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
      connections: this.connections.toJSON(),
      nodes: this.nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  update(network: NetworkProps): void {
    this._logger.trace("update");
    this.nodes.update(network.nodes);
    this.connections.update(network.connections);

    // Update states.
    this.updateStates();
  }

  updateStates(): void {
    this.nodes.updateStates();
    this.connections.updateStates();
    this._state.updateHash();
  }
}
