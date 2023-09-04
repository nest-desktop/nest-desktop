// norseNode.ts

import { BaseNode, NodeProps } from "@/common/node/baseNode";
import { NorseNodes } from "./norseNodes";

export interface NorseNodeProps extends NodeProps {}

export class NorseNode extends BaseNode {
  constructor(nodes: NorseNodes, node: NorseNodeProps = {}) {
    super(nodes, node, "NorseNode");
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  override clone(): NorseNode {
    return new NorseNode(this.nodes, { ...this.toJSON() });
  }
}
