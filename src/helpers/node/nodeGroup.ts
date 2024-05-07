// nodeGroup.ts

import { UnwrapRef, reactive } from "vue";

import { TNetwork } from "@/types/networkTypes";
import { BaseObj } from "../common/base";
import { NodeGroupView } from "./nodeGroupView";
import { TNode } from "@/types/nodeTypes";
import { TNodes } from "@/types/nodesTypes";
import { TConnection } from "@/types/connectionTypes";

export interface INodeGroupProps {
  nodes: number[];
}

interface INodeGroupState {
  connectionPanelIdx: number | null;
}

export class NodeGroup extends BaseObj {
  private _parent: TNodes;
  private _nodes: (NodeGroup | TNode)[] = [];
  private _state: UnwrapRef<INodeGroupState>;
  private _view: NodeGroupView;

  constructor(parent: TNodes, nodeGroupProps: INodeGroupProps) {
    super();
    this._parent = parent;
    this._nodes = nodeGroupProps.nodes.map(
      (idx: number) => this._parent.nodes[idx]
    );

    this._state = reactive({
      connectionPanelIdx: null,
    });
    this._view = new NodeGroupView(this);

    this.updateHash();
  }

  get all(): (NodeGroup | TNode)[] {
    return this._nodes;
  }

  get connections(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.sourceIdx === this.idx
    );
  }

  get elementType(): string {
    return "group";
  }

  get idx(): number {
    return this._parent.all.indexOf(this);
  }

  get isGroup(): boolean {
    return true;
  }

  get isNode(): boolean {
    return false;
  }

  /**
   * Check if this node is selected.
   */
  get isSelected(): boolean {
    return this.parentNodes.state.selectedNodes.includes(this);
  }

  get network(): TNetwork {
    return this._parent.network;
  }

  get nodeGroups(): NodeGroup[] {
    return this._nodes.filter(
      (node: NodeGroup | TNode) => node.isGroup
    ) as NodeGroup[];
  }

  get nodeItems(): TNode[] {
    return this._nodes.filter(
      (node: NodeGroup | TNode) => node.isNode
    ) as TNode[];
  }

  get nodeItemsDeep(): TNode[] {
    return [
      ...new Set(
        this.nodes
          .map((node: NodeGroup | TNode) => {
            if (node.isGroup) {
              const nodeGroup = node as NodeGroup;
              return nodeGroup.nodeItemsDeep as TNode[];
            }
            return node as TNode;
          })
          .flat()
      ),
    ];
  }

  get nodes(): (NodeGroup | TNode)[] {
    return this._nodes;
  }

  get parent(): NodeGroup | TNodes {
    return this._parent;
  }

  get parentNodes(): TNodes {
    return this._parent as TNodes;
  }

  get state(): UnwrapRef<INodeGroupState> {
    return this._state;
  }

  get toCode(): string {
    return this.nodes
      .map((node: NodeGroup | TNode) => node.view.label)
      .join(" + ");
  }

  get view(): NodeGroupView {
    return this._view;
  }

  /**
   * Observer for node group changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this.logger.trace("changes");

    this.update();
    this.parent.network.changes();
  }

  /**
   * Delete node group.
   *
   * @remarks
   * It removes node group component of the network.
   */
  remove(): void {
    this.network.deleteNode(this);
  }

  /**
   * Remove node item or group
   * @param node node object
   */
  removeNode(node: NodeGroup | TNode): void {
    this._nodes = this._nodes.filter((n: NodeGroup | TNode) => n !== node);
  }

  /**
   * Select this node group.
   */
  select(): void {
    this._parent.toggleNodeSelection(this);
  }

  get show(): boolean {
    return this._parent.showNode(this);
  }

  toJSON(): INodeGroupProps {
    return {
      nodes: this.nodes.map((node: NodeGroup | TNode) => node.idx),
    };
  }

  /**
   * Update node.
   */
  update(): void {
    this.updateHash();
  }

  /**
   * Update hash.
   */

  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
