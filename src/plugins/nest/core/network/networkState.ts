// networkState.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { Connection } from "../connection/connection";
import { Network } from "./network";
import { Node } from "../node/node";

export class NetworkState {
  private _displayIdx = {
    connections: [],
    models: [],
    nodes: [],
  };

  private _elementTypes: string[] = [
    "neuron",
    "stimulator",
    "recorder",
    "model",
  ];
  private _elementTypeIdx: number = 0;
  private _focusedConnection?: Connection;
  private _focusedNode?: Node;
  private _state: UnwrapRef<any>;

  private _icons = {
    all: {
      off: "mdi-checkbox-blank-outline",
      on: "mdi-checkbox-marked-outline",
      tab: "mdi-all-inclusive",
    },
    model: { tab: "$copyModel" },
    neuron: {
      off: "mdi-alpha-n-box-outline",
      on: "mdi-alpha-n-box",
      tab: "mdi-shape-outline",
    },
    recorder: {
      off: "mdi-alpha-r-box-outline",
      on: "mdi-alpha-r-box",
      tab: "$recorder",
    },
    stimulator: {
      off: "mdi-alpha-s-box-outline",
      on: "mdi-alpha-s-box",
      tab: "$stimulator",
    },
    synapse: { off: "mdi-alpha-s-circle-outline", on: "mdi-alpha-s-circle" },
  };

  private _network: Network; // parent
  private _nodeAnnotations: any[] = [];
  private _selectedConnection?: Connection;
  private _selectedNode?: Node;

  constructor(network: Network) {
    this._network = network;
    this._state = reactive({
      hash: "",
      nodesLength: 0,
      connectionsLength: 0,
    });
  }

  get connectionsLength(): number {
    return this._state.connectionsLength;
  }

  set connectionsLength(value: number) {
    this._state.connectionsLength = value;
  }

  get displayIdx(): any {
    return this._displayIdx;
  }

  get elementType(): string {
    return this._elementTypes[this._elementTypeIdx];
  }

  get elementTypes(): string[] {
    return this._elementTypes;
  }

  get elementTypeIdx(): number {
    return this._elementTypeIdx;
  }

  set elementTypeIdx(value: number) {
    this._elementTypeIdx = value;
  }

  get isNodeSourceSelected(): boolean {
    const selectedNode = this.selectedNode;
    return selectedNode ? !selectedNode.model.isWeightRecorder : false;
  }

  get isWeightRecorderSelected(): boolean {
    const selectedNode = this.selectedNode;
    return selectedNode ? selectedNode.model.isWeightRecorder : false;
  }

  get focusedConnection(): Connection | undefined {
    return this._focusedConnection;
  }

  set focusedConnection(connection: Connection | undefined) {
    this._focusedNode = undefined;
    this._focusedConnection = connection;
  }

  get focusedNode(): Node | undefined {
    return this._focusedNode;
  }

  set focusedNode(node: Node | undefined) {
    this._focusedConnection = undefined;
    this._focusedNode = node;
  }

  get hash(): string {
    return this._state.hash;
  }

  get icons(): any {
    return this._icons;
  }

  get nodeAnnotations(): any {
    return this._nodeAnnotations;
  }

  get nodesLength(): number {
    return this._state.nodesLength;
  }

  set nodesLength(value: number) {
    this._state.nodesLength = value;
  }

  get selectedConnection(): Connection | undefined {
    return this._selectedConnection;
  }

  set selectedConnection(connection: Connection | undefined) {
    this._selectedNode = undefined;
    this._selectedConnection =
      this._selectedConnection !== connection ? connection : undefined;
  }

  get selectedNode(): Node | undefined {
    return this._selectedNode;
  }

  set selectedNode(node: Node | undefined) {
    this._selectedConnection = undefined;
    this._selectedNode = this._selectedNode !== node ? node : undefined;
  }

  get state(): any {
    return this._state;
  }

  /**
   * Reset focus and selection.
   */
  reset(): void {
    this.resetFocus();
    this.resetSelection();
  }

  /**
   * Reset focus.
   */
  resetFocus(): void {
    this._focusedNode = undefined;
    this._focusedConnection = undefined;
  }

  /**
   * Reset selection.
   */
  resetSelection(): void {
    this._selectedNode = undefined;
    this._selectedConnection = undefined;
  }

  //
  // Node
  //

  /**
   * Check if node is focused.
   */
  isNodeFocused(node: Node): boolean {
    return this._focusedNode === node;
  }

  /**
   * Check if node is selected.
   */
  isNodeSelected(
    node: Node,
    unselected: boolean = true,
    withConnection: boolean = true
  ): boolean {
    if (this._selectedNode != null) {
      return this._selectedNode === node;
    } else if (this._selectedConnection != null && withConnection) {
      const connections: Connection[] = node.network.connections.filter(
        (connection: Connection) =>
          connection.sourceIdx === node.idx || connection.targetIdx === node.idx
      );
      return connections.some(
        (connection: Connection) => connection === this.selectedConnection
      );
    }
    return unselected;
  }

  //
  // Connection
  //

  /**
   * Check if connection is focused.
   */
  isConnectionFocused(
    connection: Connection,
    unselected: boolean = true
  ): boolean {
    if (this._focusedConnection != null) {
      return this._focusedConnection === connection;
    } else if (this._focusedNode != null) {
      return this._focusedNode === connection.source;
    }
    return unselected;
  }

  /**
   * Check if connection is selected.
   */
  isConnectionSelected(
    connection: Connection,
    unselected: boolean = true
  ): boolean {
    if (this._selectedConnection != null) {
      return this._selectedConnection === connection;
    } else if (this._selectedNode != null) {
      return this._selectedNode === connection.source;
    }
    return unselected;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    // console.log('Update Hash');
    this._state.hash = sha1({
      nodes: this._network.nodes.state.hash,
      connections: this._network.connections.state.hash,
    });
  }

  /**
   * Update node annotations.
   */
  updateNodeAnnotations(): void {
    this._nodeAnnotations = [];
    if (this._network.nodes.all.length === 0) return;

    const nodeAnnotationsDict: { [key: string]: string[] } = {};
    this._network.nodes
      .filter((node: Node) => node.annotations.length > 0)
      .forEach((node: Node) => {
        const nodeLabel = node.view.label;
        node.annotations.forEach((annotation: string) => {
          if (annotation in nodeAnnotationsDict) {
            nodeAnnotationsDict[annotation].push(nodeLabel);
          } else {
            nodeAnnotationsDict[annotation] = [nodeLabel];
          }
        });
      });

    if (nodeAnnotationsDict) {
      Object.keys(nodeAnnotationsDict).forEach((userDictKey: string) => {
        const nodes = nodeAnnotationsDict[userDictKey];
        const nodesStr =
          nodes.length === 1 ? nodes[0] : "(" + nodes.join("+") + ")";
        this._nodeAnnotations.push({
          key: userDictKey,
          value: nodesStr,
        });
      });
    }
  }
}
