// nodeGroup.ts

import { TConnection, TNetwork, TNode, TNodes } from "@/types";

import { BaseObj } from "../common/base";
import { NodeGroupView } from "./nodeGroupView";

export interface INodeGroupProps {
  nodes: number[];
}

export class NodeGroup extends BaseObj {
  private _parent: TNodes;
  private _nodes: (NodeGroup | TNode)[] = [];
  private _view: NodeGroupView;

  constructor(parent: TNodes, nodeGroupProps: INodeGroupProps) {
    super();
    this._parent = parent;
    this._nodes = nodeGroupProps.nodes.map(
      (idx: number) => this._parent.nodes[idx]
    );

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

  get spatial(): { hasPosition: boolean } {
    return { hasPosition: false };
  }

  get idx(): number {
    return this._parent.all.indexOf(this);
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this._view.synWeights === "excitatory";
  }

  get isGroup(): boolean {
    return true;
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this._view.synWeights === "inhibitory";
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

  /**
   * Check if this node is selected for connection.
   */
  get isSelectedForConnection(): boolean {
    return this.parentNodes.network.connections.state.selectedNode === this;
  }

  get model(): boolean {
    return false;
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

  get show(): boolean {
    return this._parent.showNode(this);
  }

  get size(): number {
    return 0;
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
   * Clean node group.
   */
  clean(): void {
    this.view.updateCentroid();
  }

  /**
   * Initialize node group.
   */
  init(): void {
    this.logger.trace("init");

    this.update();
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

  /**
   * Select this node as source for connection.
   */
  selectForConnection(): void {
    this._parent.network.connections.state.selectedNode = this;
  }

  /**
   * Serialize for JSON.
   * @return node group props
   */
  toJSON(): INodeGroupProps {
    return {
      nodes: this.nodes.map((node: NodeGroup | TNode) => node.idx),
    };
  }

  /**
   * Update node.
   */
  update(): void {
    this.view.updateCentroid();
    this.updateHash();
  }

  /**
   * Update hash.
   */

  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
