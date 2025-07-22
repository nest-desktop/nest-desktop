// connections.ts

import { UnwrapRef, reactive } from "vue";

import { TConnection, TNetwork, TNode, TNodeGroup } from "@/types";

import { BaseConnection, IConnectionProps } from "./connection";
import { BaseObj } from "../common/base";
import { AbstractCodeNode } from "../codeGraph/codeNode";

interface IConnectionsState {
  focusedConnection: TConnection | null;
  selectedConnection: TConnection | null;
  selectedNode: TNode | TNodeGroup | null;
}

export class BaseConnections extends BaseObj {
  private _state: UnwrapRef<IConnectionsState>; // reactive state
  // public _connections: TConnection[] = [];
  public _network: TNetwork; // parent

  constructor(network: TNetwork, connectionsProps: IConnectionProps[] = []) {
    super();

    this._network = network;

    this._state = reactive<IConnectionsState>({
      focusedConnection: null,
      selectedConnection: null,
      selectedNode: null,
    });

    this.update(connectionsProps);
  }

  get Connection() {
    return BaseConnection;
  }

  get allConnections(): TConnection[] {
    return this.connections as TConnection[];
  }

  override get codeNodes(): AbstractCodeNode[] {
    return this.network.project.code.graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Connect") ?? [];
  }

  get connections(): TConnection[] {
    return this.codeNodes
      .filter((node: AbstractCodeNode) => node.view)
      .map((node: AbstractCodeNode) => node.view) as TConnection[];
  }

  /**
   * filter connection list without recorders.
   */
  get connectionsWithoutRecorders(): TConnection[] {
    return this.connections.filter((connection: TConnection) => !connection.view.connectRecorder());
  }

  /**
   * Get length of connection list.
   */
  get length(): number {
    return this.connections.length;
  }

  get network(): TNetwork {
    return this._network;
  }

  get some() {
    return this.connections.some;
  }

  get state(): UnwrapRef<IConnectionsState> {
    return this._state;
  }

  // get visibleConnections(): TConnection[] {
  //   return this._connections.filter(
  //     (connection: TConnection) => connection.view.state.visible
  //   );
  // }

  /**
   * Create connection component.
   * @param connectionProps connection props
   * @returns connection object
   */
  createConnection(codeNode: AbstractCodeNode, connectionProps: IConnectionProps): TConnection {
    this.logger.trace("create connection");

    const connection: TConnection = new this.Connection(this, connectionProps);
    connection.codeNodes.node = codeNode;

    connection.init();

    return connection;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.logger.trace("clean");

    if (!this.connections) return;

    this.connections.forEach((connection: TConnection) => connection.clean());
  }

  /**
   * Clear connections.
   */
  clear(): void {
    this.logger.trace("clear");

    this.resetState();
  }

  /**
   * Initialize connections.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.connections.forEach((connection: TConnection) => connection.init());
  }

  /**
   * Remove connection component from the network.
   * @param connection connection object
   */
  remove(connection: TConnection): void {
    this.logger.trace("remove");

    this.resetState();

    // connection.removeCodeNodes();

    // Remove connection from the connection list.
    // this._connections.splice(connection.idx, 1);

    this.clean();
  }

  /**
   * Remove connections by the node.
   * @param node node object
   */
  removeByNode(node: TNode | TNodeGroup): void {
    this.resetState();

    this.connections
      .filter((connection: TConnection) => connection.source === node || connection.target == node)
      .forEach((connection: TConnection) => connection.removeCodeNodes());

    this._connections = this.connections.filter(
      (connection: TConnection) => connection.source !== node && connection.target !== node,
    );

    // Update source and target idx in connections
    this.connections.forEach((connection: TConnection) => {
      if (connection.sourceIdx > node.idx) connection.sourceIdx -= 1;
      if (connection.targetIdx > node.idx) connection.targetIdx -= 1;
    });

    this.clean();
  }

  /*
   * Reset all states.
   */
  resetState(): void {
    this._state.focusedConnection = null;
    this._state.selectedConnection = null;
  }

  /**
   * Serialize for JSON.
   * @return connection props
   */
  toJSON(): IConnectionProps[] {
    return this.connections.map((connection: TConnection) => connection.toJSON());
  }

  unfocusConnection(): void {
    this._state.focusedConnection = null;
  }

  unselectConnection(): void {
    this._state.selectedConnection = null;
  }

  unselectAll(): void {
    this._state.selectedConnection = null;
    this._state.selectedNode = null;
  }

  /**
   * Update connections.
   */
  update(): void {
    this.logger.trace("update");

    // if (connectionsProps)
    //   connectionsProps.forEach((connectionProps: IConnectionProps) => this.addConnection(connectionProps));

    this.clean();
    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      connections: this.connections.map((connection: TConnection) => connection.hash),
    });
  }
}
