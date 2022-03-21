import { sha1 } from 'object-hash';

import { Connection } from '../connection/connection';
import { Network } from './network';
import { Node } from '../node/node';

export class NetworkState {
  private _displayIdx = {
    connections: [],
    models: [],
    nodes: [],
  };

  private _elementTypes: string[] = [
    'all',
    'neuron',
    'stimulator',
    'recorder',
    'model',
  ];
  private _elementTypeIdx: number = 0;
  private _focusedConnection: number | null = null;
  private _focusedNode: number | null = null;
  private _hash: string; // network hash

  private _icons: any = {
    all: {
      on: 'mdi-checkbox-marked-outline',
      off: 'mdi-checkbox-blank-outline',
      tab: 'mdi-all-inclusive',
    },
    model: { tab: '$copyModel' },
    neuron: {
      on: 'mdi-alpha-n-box',
      off: 'mdi-alpha-n-box-outline',
      tab: 'mdi-shape-outline',
    },
    recorder: {
      on: 'mdi-alpha-r-box',
      off: 'mdi-alpha-r-box-outline',
      tab: '$recorder',
    },
    stimulator: {
      on: 'mdi-alpha-s-box',
      off: 'mdi-alpha-s-box-outline',
      tab: '$stimulator',
    },
    synapse: { on: 'mdi-alpha-s-circle', off: 'mdi-alpha-s-circle-outline' },
  };

  private _network: Network; // parent
  private _selectedConnection: number | null = null;
  private _selectedNode: number | null = null;

  constructor(network: Network) {
    this._network = network;
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
    return this._selectedNode != null
      ? !this.selectedNode.model.isWeightRecorder
      : false;
  }

  get isWeightRecorderSelected(): boolean {
    return this._selectedNode != null
      ? this.selectedNode.model.isWeightRecorder
      : false;
  }

  get focusedConnection(): Connection | null {
    return this._network.connections[this._focusedConnection];
  }

  set focusedConnection(connection: Connection | null) {
    this._focusedNode = null;
    this._focusedConnection = connection.idx;
  }

  get focusedNode(): Node | null {
    return this._network.nodes[this._focusedNode];
  }

  set focusedNode(node: Node | null) {
    this._focusedConnection = null;
    this._focusedNode = node.idx;
  }

  get hash(): string {
    return this._hash;
  }

  get icons(): any {
    return this._icons;
  }

  get selectedConnection(): Connection | null {
    return this._network.connections[this._selectedConnection];
  }

  set selectedConnection(connection: Connection | null) {
    this._selectedNode = null;
    this._selectedConnection =
      this._selectedConnection === connection.idx ? null : connection.idx;
  }

  get selectedNode(): Node | null {
    return this._network.nodes[this._selectedNode];
  }

  set selectedNode(node: Node | null) {
    this._selectedConnection = null;
    this._selectedNode = this._selectedNode === node.idx ? null : node.idx;
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
    this._focusedNode = null;
    this._focusedConnection = null;
  }

  /**
   * Reset selection.
   */
  resetSelection(): void {
    this._selectedNode = null;
    this._selectedConnection = null;
  }

  //
  // Node
  //

  /**
   * Check if node is focused.
   */
  isNodeFocused(node: Node): boolean {
    return this._focusedNode === node.idx;
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
      return this._selectedNode === node.idx;
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
      return this._focusedConnection === connection.idx;
    } else if (this._focusedNode != null) {
      return this._focusedNode === connection.sourceIdx;
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
      return this._selectedConnection === connection.idx;
    } else if (this._selectedNode != null) {
      return this._selectedNode === connection.sourceIdx;
    }
    return unselected;
  }

  /**
   * Calculate hash of this component.
   */
  updateHash(): void {
    this._hash = sha1({
      network: this._network.toJSON(),
      darkMode: this._network.project.app.darkMode,
    });
  }
}
