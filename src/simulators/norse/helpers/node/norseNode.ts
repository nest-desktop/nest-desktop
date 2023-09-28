// norseNode.ts

import { BaseNode, NodeProps } from "@/helpers/node/baseNode";

import { NorseConnection } from "../connection/norseConnection";
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

  override get connections(): NorseConnection[] {
    return this.network.connections.all.filter(
      (connection: NorseConnection) => connection.sourceIdx === this.idx
    );
  }

}
