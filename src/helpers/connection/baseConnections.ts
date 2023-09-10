// baseConnections.ts

import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Connection } from "@/types/connectionTypes";
import { Network } from "@/types/networkTypes";
import { Node } from "@/types/nodeTypes";
import { logger as mainLogger } from "@/helpers/common/logger";

import { BaseConnection, ConnectionProps } from "./baseConnection";

interface ConnectionsState {
  focusedConnection: Connection | null;
  hash: string;
  selectedConnection: Connection | null;
}

export class BaseConnections {
  private _logger: Logger<ILogObj>;
  private _state: UnwrapRef<ConnectionsState>; // reactive state

  public _connections: Connection[] = [];
  public _network: Network; // parent

  constructor(network: Network, connections: ConnectionProps[] = []) {
    this._network = network;
    this._logger = mainLogger.getSubLogger({
      name: `[${this.network.project.shortId}] connections`,
    });

    this._state = reactive({
      focusedConnection: null,
      hash: "",
      selectedConnection: null,
    });

    this.init(connections);
  }

  get all(): Connection[] {
    return this._connections as Connection[];
  }

  get connections(): Connection[] {
    return this._connections as Connection[];
  }

  /**
   * filter connection list without recorders.
   */
  get connectionsWithoutRecorders(): Connection[] {
    return this.connections.filter(
      (connection: Connection) => !connection.view.connectRecorder()
    );
  }

  /**
   * Get length of connection list.
   */
  get length(): number {
    return this._connections.length;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get network(): Network {
    return this._network;
  }

  get some() {
    return this.connections.some;
  }

  get state(): UnwrapRef<ConnectionsState> {
    return this._state;
  }

  // get visibleConnections(): Connection[] {
  //   return this._connections.filter(
  //     (connection: Connection) => connection.view.state.visible
  //   );
  // }

  /**
   * Add connection component to the network.
   */
  add(data: ConnectionProps): Connection {
    this._logger.trace("add");
    const connection: Connection = this.newConnection(data);
    this._connections.push(connection);
    return connection;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._logger.trace("clean");
    this.connections.forEach((connection: Connection) => connection.clean());

    this.updateHash();
  }

  /**
   * Clear connections.
   */
  clear(): void {
    this._logger.trace("clear");
    this.resetState();
    this._connections = [];
  }

  /**
   * Initialize network connections.
   */
  init(connections?: ConnectionProps[]): void {
    this._logger.trace("init");
    this.clear();

    if (connections) {
      this.update(connections);
    }
  }

  /**
   * Create a new connection component.
   */
  newConnection(data: ConnectionProps): BaseConnection {
    return new BaseConnection(this, data);
  }

  /**
   * Remove connection component from the network.
   *
   */
  remove(connection: Connection): void {
    this._logger.trace("remove");
    this.resetState();

    // Remove connection from the connection list.
    this._connections.splice(connection.idx, 1);
  }

  /**
   * Remove connections by the node.
   */
  removeByNode(node: Node): void {
    this.resetState();

    this._connections = this.connections.filter(
      (connection: Connection) =>
        connection.source !== node && connection.target !== node
    );

    // Update source and target idx in connections
    this.connections.forEach((connection: Connection) => {
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
   * @return connection object
   */
  toJSON(): ConnectionProps[] {
    return this.connections.map((connection: Connection) =>
      connection.toJSON()
    );
  }

  unfocusConnection(): void {
    this._state.focusedConnection = null;
  }

  unselectConnection(): void {
    this._state.selectedConnection = null;
  }

  /**
   * Update connections.
   *
   * @param connections - network object
   */
  update(connections?: ConnectionProps[]): void {
    if (connections) {
      connections.forEach((data: ConnectionProps) => this.add(data));
    }
    this.clean();
  }

  /**
   * Update states of all connections.
   */
  updateStates(): void {
    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = sha1({
      connections: this.connections.map((connection: Connection) => {
        connection.state.updateHash();
        return connection.state.hash;
      }),
    });
    this._logger.trace("update hash:", this._state.hash.slice(0, 6));
  }
}
