// nodeParameter.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { NodeParameters } from "@/network";

import { getNESTParameterNode } from "@/codeGraph/codeNodeTypes/nest/nestParameters";

import type { NESTNode } from "./node";

export class NESTNodeParameters extends NodeParameters<NESTNode> {
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
