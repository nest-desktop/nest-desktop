// synapseParameters.ts

import type { Class } from "@/types";
// import type { AbstractCodeNode } from "@babsey/code-graph";
import { SynapseParameters } from "@/networkGraph/helpers/synapse/synapseParameters";
// import { getNESTParameterNode } from "@/codeGraph/codeNodeTypes/nest/nestParameters";

import type { NESTSynapse } from "./synapse";
import { NESTSynapseParameter } from "./synapseParameter";

export class NESTSynapseParameters extends SynapseParameters {
  override get Parameter(): Class<NESTSynapseParameter> {
    return NESTSynapseParameter;
  }

  override get synapse(): NESTSynapse {
    return this._synapse;
  }

  // override registerCodeNode(codeNode?: AbstractCodeNode): void {
  //   this.logger.trace("register code node");

  //   if (!codeNode)
  //     codeNode = getNESTParameterNode(
  //       this.synapse.connection.network.project.code.graph,
  //       this.synapse.connection.codeNode,
  //       "syn_spec",
  //     );
  //   this.codeNode = codeNode;

  //   this.codeNode.mask = this;
  // }
}
