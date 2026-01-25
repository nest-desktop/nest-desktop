// nodeParameters.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { Class } from "@/types";
import { NodeParameters } from "@/network";

import type { NESTNode } from "./node";
import { NESTNodeParameter } from "./nodeParameter";
import { getNESTParameterNode } from "../../codeNodeTypes/nest";

export class NESTNodeParameters extends NodeParameters<NESTNode> {
  override get Parameter(): Class<NESTNodeParameter> {
    return NESTNodeParameter;
  }

  override registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");
    if (!codeNode) codeNode = getNESTParameterNode(this.node.codeNode, "params");
    this.codeNode = codeNode;
    this.codeNode.mask = this;
  }
}
