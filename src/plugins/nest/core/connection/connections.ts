// networkConnections.ts
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Connection, ConnectionProps } from "./connection";
import { Network } from "../network/network";
import { Node } from "../node/node";

interface ConnectionsState {
  focusedConnection: number | null;
  hash: string;
  selectedConnection: number | null;
}

export class Connections {
  private _connections: Connection[] = [];
  private _network: Network; // parent
  private _state: UnwrapRef<ConnectionsState>; // reactive state

  constructor(network: Network, connections: ConnectionProps[] = []) {
    this._network = network;

    this._state = reactive({
      focusedConnection: null,
      hash: "",
      selectedConnection: null,
    });

    this.init(connections);
  }

  get all(): Connection[] {
    return this._connections;
  }

  /**
   * filter connection list without recorders.
   */
  get connectionsWithoutRecorders(): Connection[] {
    return this._connections.filter(
      (connection: Connection) => !connection.view.connectRecorder()
    );
  }

  get filter() {
    return this._connections.filter;
  }

  /**
   * Get length of connection list.
   */
  get length(): number {
    return this._connections.length;
  }

  get network(): Network {
    return this._network;
  }

  /**
   * filter connection list by weight recorder.
   */
  get recordedByWeightRecorder(): Connection[] {
    return this._connections.filter((connection: Connection) => {
      const synapseModel = connection.synapse.model;
      return synapseModel.hasWeightRecorderParam;
    });
  }

  get some() {
    return this._connections.some;
  }

  get state(): UnwrapRef<ConnectionsState> {
    return this._state;
  }

  get visibleConnections(): Connection[] {
    return this._connections.filter(
      (connection: Connection) => connection.view.visible
    );
  }

  /**
   * Add connection component to the network.
   */
  add(data: ConnectionProps): Connection {
    // console.log("Add connection");
    const connection: Connection = new Connection(this, data);
    this._connections.push(connection);
    return connection;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._connections.forEach((connection: Connection) => connection.clean());

    this._connections.forEach((connection: Connection) => {
      connection.sourceSlice.update();
      connection.targetSlice.update();
    });

    this.updateHash();
  }

  /**
   * Reset state and empty connections.
   */
  empty(): void {
    this.resetState();
    this._connections = [];
  }

  /**
   * Initialize network connections.
   */
  init(connections?: ConnectionProps[]): void {
    this.empty();

    if (connections) {
      this.update(connections);
    }
  }

  getBySynapseModelId(modelId: string): Connection | undefined {
    return this._connections.find(
      (connection: Connection) => connection.synapse.modelId === modelId
    );
  }

  /**
   * Remove connection component from the network.
   *
   */
  remove(connection: Connection): void {
    // console.log("Delete connection");
    this.resetState();

    // Remove connection from the connection list.
    this._connections.splice(connection.idx, 1);
  }

  /**
   * Remove connections by the node.
   */
  removeByNode(node: Node): void {
    this.resetState();

    this._connections = this._connections.filter(
      (connection: Connection) =>
        connection.source !== node && connection.target !== node
    );

    // Update source and target idx in connections
    this._connections.forEach((connection: Connection) => {
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
    return this._connections.map((connection: Connection) =>
      connection.toJSON()
    );
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
   * Update hash.
   */
  updateHash(): void {
    // console.log('Update Hash');
    this._state.hash = sha1({
      connections: this._connections.map(
        (connection: Connection) => connection.toJSON() //TODO connection.state.hash
      ),
    });
  }
}
