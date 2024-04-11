// network.ts

import { BaseConnections } from "../connection/connections";
import { BaseNodes } from "../node/nodes";
import { BaseObj } from "@/helpers/common/base";
import { IConnectionProps } from "../connection/connection";
import { INodeProps } from "../node/node";
import { INodeViewProps } from "../node/nodeView";
import { NetworkState } from "./networkState";
import { TConnection } from "@/types/connectionTypes";
import { TConnections } from "@/types/connectionsTypes";
import { TNetwork } from "@/types/networkTypes";
import { TNode } from "@/types/nodeTypes";
import { TNodes } from "@/types/nodesTypes";
import { TProject } from "@/types/projectTypes";

export interface INetworkProps {
  nodes?: INodeProps[];
  connections?: IConnectionProps[];
}

export class BaseNetwork extends BaseObj {
  private _state: NetworkState; // network state

  public _connections: TConnections;
  public _nodes: TNodes;
  public _project: TProject; // parent
  // private _graph: NetworkGraph;

  private _defaultModels: { [key: string]: string } = {
    neuron: "iaf_psc_alpha",
    recorder: "voltmeter",
    stimulator: "dc_generator",
  };

  constructor(project: TProject, networkProps: INetworkProps = {}) {
    super({
      config: { name: "Network" },
      logger: { settings: { minLevel: 3 } },
    });

    // this._graph = new NetworkGraph(this);

    this._project = project;
    this._state = new NetworkState(this);

    this._nodes = new this.Nodes(this, networkProps.nodes);
    this._connections = new this.Connections(this, networkProps.connections);
  }

  get Connections() {
    return BaseConnections;
  }

  get Nodes() {
    return BaseNodes;
  }

  get colors(): string[] {
    return this.config?.localStorage.color.cycle;
  }

  set colors(value: string[]) {
    const color: { cycle: string[]; scheme: string } =
      this.config?.localStorage.color;
    color.cycle = value;
    this.config?.localStorage.update({ color });
  }

  get connections(): TConnections {
    return this._connections;
  }

  set defaultModels(value: { [key: string]: string }) {
    this._defaultModels = value;
  }

  // get graph(): NetworkGraph {
  //   return this._graph;
  // }

  get isEmpty(): boolean {
    return this.nodes.all.length === 0 && this.connections.all.length === 0;
  }

  /**
   * Get nodes
   */
  get nodes(): TNodes {
    return this._nodes;
  }

  get project(): TProject {
    return this._project;
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
    this.logger.trace("changes");
    this.updateStyle();
    this.updateHash();
    this.project.changes();
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.logger.trace("clean");
    this.nodes.clean();
    this.connections.clean();
  }

  /**
   * Clear the network.
   */
  clear(): void {
    this.logger.trace("clear");
    this.connections.clear();
    this.nodes.clear();
  }

  /**
   * Clone base network component.
   */
  clone(): TNetwork {
    return new BaseNetwork(this.project, { ...this.toJSON() });
  }

  /**
   * Connect node components by user interaction.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  connectNodes(source: TNode, target: TNode): void {
    this.logger.trace("connect nodes");

    const connection: TConnection | undefined = this.connections.add({
      source: source.idx,
      target: target.idx,
    });

    // Trigger network change.
    this.changes();

    // Create activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.createActivity();
    }
  }

  /**
   * Create node component by user interaction.
   */
  createNode(model?: string, view?: INodeViewProps): void {
    this.logger.trace("create node");

    this.nodes?.add({
      model: model || this._defaultModels[view?.elementType || "neuron"],
      view,
    });

    this.changes();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteConnection(connection: TConnection): void {
    this.logger.trace("delete connection");

    // Remove connection from the list.
    this.connections.remove(connection);

    // Trigger network change.
    this.changes();
  }

  /**
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: TNode): void {
    this.logger.trace("delete node");

    // Remove connection from the list.
    this.connections.removeByNode(node);

    // Remove node from the list.
    this.nodes.remove(node);

    // Trigger network change.
    this.changes();
  }

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config?.localStorage.color.cycle;
    return colors[idx % colors.length];
  }

  /**
   * Initialize network.
   */
  init(): void {
    this.logger.trace("init");

    this.nodes.init();
    this.connections.init();

    this.updateStyle();
    this.updateHash();
  }

  /**
   * Serialize for JSON.
   * @return network props
   */
  toJSON(): INetworkProps {
    return {
      connections: this.connections.toJSON(),
      nodes: this.nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   *
   * @param networkProps - network props
   */
  update(networkProps: INetworkProps): void {
    this.logger.trace("update");

    this.nodes.update(networkProps.nodes);
    this.connections.update(networkProps.connections);

    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      nodes: this.nodes.all.map((node: TNode) => node.hash),
      connections: this.connections.all.map(
        (connection: TConnection) => connection.hash
      ),
    });
  }

  /**
   * Update node style, e.g. node color.
   */
  updateStyle(): void {
    this.logger.trace("update node style");
    this._nodes.all.forEach((node: TNode) => node.view.updateStyle());
  }
}
