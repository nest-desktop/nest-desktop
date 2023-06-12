// nodeState.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";
import { Node } from "./node";
import { NodeParameter } from "./nodeParameter";

interface NodeStateState {
  hash: string;
}

export class NodeState {
  private _node: Node; // parent
  private _state: UnwrapRef<NodeStateState>;

  constructor(node: Node) {
    this._node = node;

    this._state = reactive({
      hash: "",
    });

    this.updateHash();
  }

  get hash(): string {
    return this._state.hash;
  }

  /**
   * Check if this node is focused.
   */
  get isFocused(): boolean {
    return this._node.network.state.isNodeFocused(this._node);
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
  get isSelected(): boolean {
    return this._node.network.state.isNodeSelected(this._node, false);
  }

  get node(): Node {
    return this._node;
  }

  get state(): UnwrapRef<NodeStateState> {
    return this._state;
  }

  /**
   * Returns the first six digits of the SHA-1 node hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._state.hash ? this._state.hash.slice(0, 6) : "";
  }

  /**
   * Focus this node
   */
  focus(forced: boolean = false): void {
    // console.log("Focus node of " + this._node.network.project.shortId);
    const networkState = this._node.network.state;
    if (forced) {
      networkState.resetFocus();
    }
    networkState.focusedNode = this._node;
  }

  /**
   * Select this node
   */
  select(forced: boolean = false): void {
    // console.log("Select node of " + this._node.network.project.shortId);
    const networkState = this._node.network.state;
    if (forced) {
      networkState.resetSelection();
    }
    networkState.selectedNode = this._node;
  }

  /**
   * Update hash
   */
  updateHash(): void {
    this._state.hash = sha1({
      model: this._node.modelId,
      params: Object.values(this._node.params).map((param: NodeParameter) => param.toJSON()),
      size: this._node.size,
    });
  }
}