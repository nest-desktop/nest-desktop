// nodeGroup.ts

import { BaseObj } from "../common/base";
import { TNode } from "@/types/nodeTypes";

export class NodeGroup extends BaseObj {
  private _idx: number = 0;
  private _nodes: (TNode | NodeGroup)[] = [];

  constructor() {
    super();
  }

  get all(): (TNode | NodeGroup)[] {
    return this._nodes;
  }

  get idx(): number {
    return this._idx;
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
}
