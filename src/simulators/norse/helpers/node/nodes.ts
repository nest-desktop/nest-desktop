// nodes.ts

import { BaseNodes } from "@/helpers/node/nodes";

import { NorseNetwork } from "../network/network";
import { NorseNode, NorseNodeProps } from "./node";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: NorseNodeProps[]) {
    super(network, nodes);
  }

  override newNode(data?: NorseNodeProps): NorseNode {
    return new NorseNode(this, data);
  }
}