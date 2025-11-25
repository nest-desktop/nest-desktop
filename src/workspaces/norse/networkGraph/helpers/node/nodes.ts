// nodes.ts

import { BaseNodes } from "@/networkGraph/helpers/node/nodes";
import type { INodeState } from "@/networkGraph/helpers/node/node";
import type { TNode, TNodeGroup } from "@/types";

import { NorseNetwork } from "../network/network";
import { NorseNode } from "./node";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: INodeState[]) {
    super(network, nodes);
  }

  override get Node() {
    return NorseNode;
  }

  override get nodeItems(): NorseNode[] {
    return this._nodes.filter((node: TNode | TNodeGroup) => node.isNode) as NorseNode[];
  }
}
