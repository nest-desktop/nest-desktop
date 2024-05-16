// connections.ts

import { UnwrapRef, reactive } from "vue";

import { TConnection, TNetwork, TNode } from "@/types";

import { BaseObj } from "../common/base";
import { NodeGroup } from "../node/nodeGroup";
import { BaseConnection, IConnectionProps } from "./connection";

interface IConnectionsState {
  focusedConnection: TConnection | null;
  selectedConnection: TConnection | null;
  selectedNode: NodeGroup | TNode | null;
}

export class BaseConnections extends BaseObj {
  private _state: UnwrapRef<IConnectionsState>; // reactive state
  public _connections: TConnection[] = [];
  public _network: TNetwork; // parent

  constructor(network: TNetwork, connectionsProps: IConnectionProps[] = []) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._network = network;

    this._state = reactive({
      focusedConnection: null,
      hash: "",
      selectedConnection: null,
      selectedNode: null,
    });

    this.update(connectionsProps);
  }

  get Connection() {
    return BaseConnection;
  }

  get all(): TConnection[] {
    return this._connections as TConnection[];
  }

  get connections(): TConnection[] {
    return this._connections as TConnection[];
  }

  /**
   * filter connection list without recorders.
   */
  get connectionsWithoutRecorders(): TConnection[] {
    return this.connections.filter(
      (connection: TConnection) => !connection.view.connectRecorder()
    );
  }

  /**
   * Get length of connection list.
   */
  get length(): number {
    return this._connections.length;
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
   * Add connection component to the network.
   * @param connectionProps connection props
   * @returns connection object
   */
  add(connectionProps: IConnectionProps): TConnection {
    this.logger.trace("add");

    const connection: TConnection = new this.Connection(this, connectionProps);
    this._connections.push(connection);
    return connection;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.logger.trace("clean");

    this.connections.forEach((connection: TConnection) => connection.clean());
  }

  /**
   * Clear connections.
   */
  clear(): void {
    this.logger.trace("clear");

    this.resetState();
    this._connections = [];
  }

  /**
   * Initialize connections.
   */
  init(): void {
    this.logger.trace("init");

    this._connections.forEach((connection: TConnection) => connection.init());
  }

  /**
   * Remove connection component from the network.
   * @param connection connection object
   */
  remove(connection: TConnection): void {
    this.logger.trace("remove");

    this.resetState();

    // Remove connection from the connection list.
    this._connections.splice(connection.idx, 1);
  }

  /**
   * Remove connections by the node.
   * @param node node object
   */
  removeByNode(node: NodeGroup | TNode): void {
    this.resetState();

    this._connections = this.connections.filter(
      (connection: TConnection) =>
        connection.source !== node && connection.target !== node
    );

    // Update source and target idx in connections
    this.connections.forEach((connection: TConnection) => {
      if (connection.sourceIdx > node.idx) {
        connection.sourceIdx -= 1;
      }
      if (connection.targetIdx > node.idx) {
        connection.targetIdx -= 1;
      }
    });
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
    return this.connections.map((connection: TConnection) =>
      connection.toJSON()
    );
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
   * @param connectionsProps connection props
   */
  update(connectionsProps?: IConnectionProps[]): void {
    this.logger.trace("update");

    if (connectionsProps) {
      connectionsProps.forEach((connectionProps: IConnectionProps) =>
        this.add(connectionProps)
      );
    }

    this.clean();
    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      connections: this.connections.map(
        (connection: TConnection) => connection.hash
      ),
    });
  }
}
