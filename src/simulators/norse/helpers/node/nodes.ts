// nodes.ts

import { BaseNodes } from "@/helpers/node/nodes";
import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TNode } from "@/types/nodeTypes";

import { NorseNetwork } from "../network/network";
import { NorseNode, INorseNodeProps } from "./node";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: INorseNodeProps[]) {
    super(network, nodes);
  }

  override get Node() {
    return NorseNode;
  }

  override get nodes(): NorseNode[] {
    return this._items.filter(
      (node: TNode | NodeGroup) => !node.isGroup
    ) as NorseNode[];
  }
}
