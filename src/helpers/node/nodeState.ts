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
    return this.node.nodes.state.selectedNode === this.node;
  }

  get node(): TNode {
    return this._node;
  }

  get show(): boolean {
    return this._node.nodes.showNode(this._node);
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

  /**
   * Select this node.
   */
  select(): void {
    const nodes = this.node.nodes;
    nodes.state.selectedNode = this.isSelected ? null : this.node;
  }
}
