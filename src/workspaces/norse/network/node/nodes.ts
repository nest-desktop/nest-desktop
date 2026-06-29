// nodes.ts

import { BaseNodes } from "@/network/node";
// import type { TNode, TNodeGroup } from "@/types";

// import { NorseNetwork } from "../network";
import { NorseNode } from "./node";

export class NorseNodes extends BaseNodes {
  // constructor(network: NorseNetwork) {
  //   super(network);
  // }

  override get Node() {
    return NorseNode;
  }

  // override get nodeItems(): NorseNode[] {
  //   return this._nodes.filter((node: TNode | TNodeGroup) => node.isNode) as NorseNode[];
  // }
}
