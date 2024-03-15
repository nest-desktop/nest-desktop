// nodes.ts

import { BaseNodes } from "@/helpers/node/nodes";

import { NorseNetwork } from "../network/network";
import { NorseNode, INorseNodeProps } from "./node";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: INorseNodeProps[]) {
    super(network, nodes);
  }

  override get Node() {
    return NorseNode;
  }

  override get all(): NorseNode[] {
    return this._nodes as NorseNode[];
  }
}
