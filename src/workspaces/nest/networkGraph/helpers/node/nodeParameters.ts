// nodeParameter.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { NodeParameters } from "@/networkGraph/helpers/node/nodeParameters";
import {
  getNESTParameterNode,
  // updateParameterInterfaces,
} from "@/codeGraph/codeNodeTypes/nest/nestParameters";

export class NESTNodeParameters extends NodeParameters {
  override registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");
    if (!codeNode) codeNode = getNESTParameterNode(this.node.codeNode, "params");
    this.codeNode = codeNode;
    this.codeNode.mask = this;
  }

  // updateCodeNode(): void {
  //   this.logger.trace("update code node");
  //   updateParameterInterfaces(this.node.codeNode, "params", this.save());
  // }
}
