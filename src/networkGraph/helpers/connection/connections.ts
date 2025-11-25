// connections.ts

import { type UnwrapRef, reactive } from "vue";
import type { AbstractCodeNode } from "@babsey/code-graph";

import type { Class, TConnection, TNetwork, TNode, TNodeGroup } from "@/types";

import { BaseConnection, type IConnectionState } from "./connection";
import { BaseObj, IBaseState } from "@/helpers/common/base";

interface IConnectionsRefState {
  focusedConnection: TConnection | null;
  selectedConnection: TConnection | null;
  selectedNode: TNode | TNodeGroup | null;
}

export class BaseConnections extends BaseObj {
  private _state: UnwrapRef<IConnectionsRefState> = reactive<IConnectionsRefState>({
    focusedConnection: null,
    selectedConnection: null,
    selectedNode: null,
  });
  public _network: TNetwork; // parent

  constructor(network: TNetwork) {
    super();

    this._network = network;
  }

  get Connection(): Class<BaseConnection> {
    return BaseConnection;
  }

  get all(): TConnection[] {
    return this.connections as TConnection[];
  }

  get codeNodes(): AbstractCodeNode[] {
    return [];
  }

  get connections(): TConnection[] {
    return this.codeNodes
      .filter((codeNode: AbstractCodeNode) => codeNode.mask)
      .map((codeNode: AbstractCodeNode) => codeNode.mask);
  }

  /**
   * filter connection list without recorders.
   */
  get connectionsWithoutRecorders(): TConnection[] {
    return this.connections.filter((connection: TConnection) => !connection.view.connectRecorder());
  }

  override get hashObject(): IBaseState {
    return {
      connections: this.connections.map((connection: TConnection) => connection.hash),
    };
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

  get state(): UnwrapRef<IConnectionsRefState> {
    return this._state;
  }

  // get visibleConnections(): TConnection[] {
  //   return this._connections.filter(
  //     (connection: TConnection) => connection.view.state.visible
  //   );
  // }

  /**
   * Add connection component to the network.
   * @param connectionState connection state
   * @returns connection instance
   */
  addConnection(connectionState: IConnectionState): TConnection {
    this.logger.trace("add");

    const connection = new this.Connection(this);
    if (connectionState) connection.load(connectionState);
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
   * Load connections from state.
   * @param connectionStates connections states
   */
  load(connectionStates?: IConnectionState[]): void {
    this.logger.trace("update");

    if (connectionStates)
      connectionStates.forEach((connectionState: IConnectionState) => this.addConnection(connectionState));

    this.clean();
    this.updateHash();
  }

  /**
   * Remove connection component from the network.
   * @param connection connection instance
   */
  remove(connection: TConnection): void {
    this.logger.trace("remove");

    this.resetState();

    connection.codeNode?.remove();

    this.clean();
  }

  /**
   * Remove connections by the node.
   * @param node node instance
   */
  removeByNode(node: TNode | TNodeGroup): void {
    this.resetState();

    this.connections
      .filter((connection: TConnection) => connection.source === node && connection.target === node)
      .forEach((connection: TConnection) => connection.remove());

    this.clean();
  }

  /*
   * Reset all states.
   */
  resetState(): void {
    this.state.focusedConnection = null;
    this.state.selectedConnection = null;
  }

  /**
   * Save connection to state.
   * @return connection state
   */
  override save(): IConnectionState[] {
    return this.connections.map((connection: TConnection) => connection.save());
  }

  unfocusConnection(): void {
    this.state.focusedConnection = null;
  }

  unselectConnection(): void {
    this.state.selectedConnection = null;
  }

  unselectAll(): void {
    this.state.selectedConnection = null;
    this.state.selectedNode = null;
  }
}
