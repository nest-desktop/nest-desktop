// norseNodes.ts

import { BaseNodes } from "@/helpers/node/baseNodes";

import { NorseNetwork } from "../network/norseNetwork";
import { NorseNode, NorseNodeProps } from "./norseNode";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: NorseNodeProps[]) {
    super(network, nodes);
  }

  override newNode(data?: NorseNodeProps): NorseNode {
    return new NorseNode(this, data);
  }
}
