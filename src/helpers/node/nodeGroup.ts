// nodeGroup.ts

import { BaseObj } from "../common/base";
import { NodeGroupView } from "./nodeGroupView";
import { TNode } from "@/types/nodeTypes";
import { TNodes } from "@/types/nodesTypes";

export class NodeGroup extends BaseObj {
  private _parent: TNodes;

  private _nodes: (TNode | NodeGroup)[] = [];
  private _view: NodeGroupView;

  constructor(parent: TNodes, nodes: TNode[]) {
    super();
    this._parent = parent;
    this._nodes = [...nodes];

    this._view = new NodeGroupView(this);
  }

  get all(): (TNode | NodeGroup)[] {
    return this._nodes;
  }

  get idx(): number {
    return this._parent.nodeGroups.indexOf(this);
  }

  get isGroup(): boolean {
    return true;
  }

  get nodes(): TNode[] {
    return this._nodes.filter(
      (node: TNode | NodeGroup) => node.constructor.name !== "NodeGroup"
    ) as TNode[];
  }

  get nodeGroups(): NodeGroup[] {
    return this._nodes.filter(
      (node: TNode | NodeGroup) => node.constructor.name === "NodeGroup"
    ) as NodeGroup[];
  }

  get parent(): TNodes {
    return this._parent;
  }

  get toCode(): string {
    return this.nodes.map((node: TNode) => node.view.label).join(" + ");
  }

  get view(): NodeGroupView {
    return this._view;
  }
}
