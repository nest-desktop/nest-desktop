import { Connection } from '../connection/connection';
import { Network } from './network';
import { Node } from '../node/node';

export class NetworkView {
  private _focusedConnection: number | null = null;
  private _focusedNode: number | null = null;
  private _network: Network; // parent
  private _selectedConnection: number | null = null;
  private _selectedElementType: string | null = null;
  private _selectedNode: number | null = null;

  constructor(network: Network) {
    this._network = network;
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

  get selectedConnection(): Connection | null {
    return this._network.connections[this._selectedConnection];
  }

  set selectedConnection(connection: Connection | null) {
    this._selectedElementType = null;
    this._selectedNode = null;
    this._selectedConnection =
      this._selectedConnection === connection.idx ? null : connection.idx;
  }

  get selectedElementType(): string | null {
    return this._selectedElementType;
  }

  set selectedElementType(value: string | null) {
    this.resetSelection();
    this._selectedElementType = value;
    // this._selectedElementType = this._selectedElementType === elementType ? null : elementType;
  }

  get selectedNode(): Node | null {
    return this._network.nodes[this._selectedNode];
  }

  set selectedNode(node: Node | null) {
    this._selectedElementType = null;
    this._selectedConnection = null;
    this._selectedNode = this._selectedNode === node.idx ? null : node.idx;
  }

  get colors(): string[] {
    return this._network.config.color.cycle;
  }

  set colors(value: string[]) {
    const color: any = this._network.config.color;
    color.cycle = value;
    this._network.config.update({ color });
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

  /**
   * Check if an element type is selected.
   */
  isElementTypeSelected(elementType: string): boolean {
    if (this._selectedElementType === null) {
      return true;
    }
    return this._selectedElementType === elementType;
  }

  /**
   * Check if network has any spatial nodes.
   */
  hasPositions(): boolean {
    return this._network.nodes.some((node: Node) =>
      node.spatial.hasPositions()
    );
  }

  //
  // Node
  //

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this._network.config.color.cycle;
    return colors[idx % colors.length];
  }

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
    if (this._selectedNode !== null) {
      return this._selectedNode === node.idx;
    } else if (this._selectedConnection !== null) {
      if (!withConnection) {
        return false;
      }
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
    if (this._focusedConnection !== null) {
      return this._focusedConnection === connection.idx;
    } else if (this._focusedNode !== null) {
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
    if (this._selectedConnection !== null) {
      return this._selectedConnection === connection.idx;
    } else if (this._selectedNode !== null) {
      return this._selectedNode === connection.sourceIdx;
    }
    return unselected;
  }
}
