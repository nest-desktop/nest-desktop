// nodeParameter.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { NodeParameters } from "@/networkGraph/helpers/node/nodeParameters";
import { getNESTParameterNode } from "@/codeGraph/codeNodeTypes/nest/nestParameters";

export class NESTNodeParameters extends NodeParameters {
  override registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");
    if (!codeNode)
      codeNode = getNESTParameterNode(this.node.nodes.network.project.code.graph, this.node.codeNode, "params");
    this.codeNode = codeNode;
    this.codeNode.mask = this;
  }

  // override updateCodeNode(values: string[]): void {
  //   this.logger.trace("update code node");
  //   const paramStates = this.save();
  //   updateNESTParameterNode(this.node.codeNode.graph, this.node.codeNode, "params", paramStates);
  //   if (!this.codeNode) this.registerCodeNode(this.node.codeNode);
  //   super.updateCodeNode(values);
  // }
}
