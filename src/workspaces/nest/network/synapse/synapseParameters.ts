// synapseParameters.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import type { Class } from "@/types";
import { SynapseParameters } from "@/network";
import { getNESTParameterNode } from "../../codeNodeTypes/nest";

import type { NESTSynapse } from "./synapse";
import { NESTSynapseParameter } from "./synapseParameter";

export class NESTSynapseParameters extends SynapseParameters<NESTSynapse> {
  override get Parameter(): Class<NESTSynapseParameter> {
    return NESTSynapseParameter;
  }

  override registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");

    if (!this.synapse.connection.codeNode) return;
    if (!codeNode) codeNode = getNESTParameterNode(this.synapse.connection.codeNode, "syn_spec");
    this.codeNode = codeNode;
    if (this.codeNode) this.codeNode.mask = this;
  }
}
