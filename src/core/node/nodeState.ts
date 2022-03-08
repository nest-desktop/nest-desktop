import { Node } from './node';

export class NodeState {
  private _node: Node; // parent

  constructor(node: Node) {
    this._node = node;
  }

  get node(): Node {
    return this._node;
  }

  /**
   * Focus this node.
   */
  focus(forced: boolean = false): void {
    this._node.consoleLog(
      'Focus node of ' + this._node.network.project.shortId
    );
    const networkState = this._node.network.state;
    if (forced) {
      networkState.resetFocus();
    }
    networkState.focusedNode = this._node;
  }

  /**
   * Check if this node is focused.
   */
  get isFocused(): boolean {
    return this._node.network.state.isNodeFocused(this._node);
  }

  /**
   * Select this node.
   */
  select(forced: boolean = false): void {
    this._node.consoleLog(
      'Select node of ' + this._node.network.project.shortId
    );
    const networkState = this._node.network.state;
    if (forced) {
      networkState.resetSelection();
    }
    networkState.selectedNode = this._node;
  }

  /**
   * Check if any node is selected.
   */
  get isAnySelected(): boolean {
    return this._node.network.state.selectedNode != null;
  }

  /**
   * Check if this node is selected.
   */
  isSelected(unselected: boolean = false): boolean {
    return this._node.network.state.isNodeSelected(this._node, unselected);
  }
}
