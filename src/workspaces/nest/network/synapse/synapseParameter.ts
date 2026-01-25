// synapseParameter.ts

import { BaseSynapseParameter } from "@/network";
import type { IParamType } from "@/parameter";

import { NESTSynapseParameters } from "./synapseParameters";
import { getNESTModelParameterStates } from "../../model";
import { type IParamState, updateNESTParameterNode } from "../../codeNodeTypes/nest";
// import type { NESTCopyModelParameter } from "../model/copyModelParameter";

export class NESTSynapseParameter extends BaseSynapseParameter<NESTSynapseParameters> {
  override get hidden(): boolean {
    return this.intf?.hidden ?? this.state.hidden;
  }

  override set hidden(value: boolean) {
    this.state.hidden = value;
    const synapse = this.synapseParams.synapse;
    if (!this.codeNode && this.synapseParams.hasSomeVisibleParams) {
      const defaultParamStates = getNESTModelParameterStates(synapse.modelId);
      updateNESTParameterNode(
        synapse.connection.codeNode,
        "syn_spec",
        defaultParamStates as Record<string, IParamState>,
      );
    }
    this.intf?.setHidden(value);
    if (this.codeNode && !this.synapseParams.hasSomeVisibleParams) {
      updateNESTParameterNode(synapse.connection.codeNode, "syn_spec");
      this.synapseParams.unregisterCodeNode();
    }
  }

  override get types(): IParamType[] {
    const types: IParamType[] = this.config?.localStorage.types;
    return !this.synapseParams.synapse.isSpatial
      ? types.filter((type: IParamType) => !type.id.startsWith("spatial"))
      : types;
  }

  // /**
  //  * Save nest synapse parameter to state.
  //  * @return nest synapse parameter state
  //  */
  // override save(): IParamState {
  //   const paramState: IParamState = {
  //     id: this.id,
  //     value: this.value,
  //   };

  //   // Add the value factors if existed.
  //   if (this.factors.length > 0) paramState.factors = this.factors;

  //   // Add the rules for validation if existed.
  //   if (this.rules.length > 0) paramState.rules = this.rules;

  //   // Add param type if not constant.
  //   if (!this.isConstant) paramState.type = this.saveType();

  //   return paramState;
  // }
}
