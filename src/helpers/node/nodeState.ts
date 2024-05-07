// nodeState.ts

import { reactive, UnwrapRef } from "vue";

import { TNode } from "@/types/nodeTypes";

interface INodeState {
  connectionPanelIdx: number | null;
}

export class NodeState {
  private _node: TNode; // parent
  private _state: UnwrapRef<INodeState>;

  constructor(node: TNode) {
    this._node = node;

    this._state = reactive({
      connectionPanelIdx: null,
    });
  }

  get connectionPanelIdx(): number | null {
    return this._state.connectionPanelIdx;
  }

  set connectionPanelIdx(value: number | null) {
    this._state.connectionPanelIdx = value;

    if (this._state.connectionPanelIdx != null) {
      this.node.connections[this._state.connectionPanelIdx].state.select();
    }
  }

  /**
   * Check if this node is focused.
   */
  get isFocused(): boolean {
    return this.node.nodes.state.focusedNode === this.node;
  }

  /**
   * Check if this node is selected.
   */
  get isSelected(): boolean {
    return this._node.nodes.state.selectedNodes.includes(this._node);
  }

  /**
   * Check if this node is selected for connection.
   */
  get isSelectedForConnection(): boolean {
    return (
      this._node.nodes.network.connections.state.selectedNode === this._node
    );
  }

  get node(): TNode {
    return this._node;
  }

  get state(): UnwrapRef<INodeState> {
    return this._state;
  }

  /**
   * Focus this node.
   */
  focus(): void {
    this.node.nodes.state.focusedNode = this.node;
  }
}
