// nodes.ts

import { BaseNodes } from "@/helpers/node/nodes";
import { INodeProps } from "@/helpers/node/node";
import { TNode, TNodeGroup } from "@/types";

import { NorseNetwork } from "../network/network";
import { NorseNode } from "./node";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: INodeProps[]) {
    super(network, nodes);
  }

  override get Node() {
    return NorseNode;
  }

  override get nodeItems(): NorseNode[] {
    return this._nodes.filter((node: TNode | TNodeGroup) => node.isNode) as NorseNode[];
  }
}
