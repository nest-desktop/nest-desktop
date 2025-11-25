// synapseParameter.ts

import { BaseSynapseParameter } from "@/networkGraph/helpers/synapse/synapseParameter";
import type { IParamState, IParamType } from "@/helpers/common";
import type { ModelParameter } from "@/helpers/model";

import type { NESTSynapse } from "./synapse";
import type { NESTCopyModelParameter } from "../model/copyModelParameter";

export class NESTSynapseParameter extends BaseSynapseParameter {

  override get modelParam(): ModelParameter | NESTCopyModelParameter | undefined {
    return this.synapse.model.params[this.id];
  }

  override get synapse(): NESTSynapse {
    return super.synapseParams.synapse as NESTSynapse;
  }

  override get types(): IParamType[] {
    const types: IParamType[] = this.config?.localStorage.types;
    return !this.synapse.isSpatial ? types.filter((type: IParamType) => !type.id.startsWith("spatial")) : types;
  }

  /**
   * Save nest synapse parameter to state.
   * @return nest synapse parameter state
   */
  override save(): IParamState {
    const paramState: IParamState = {
      id: this.id,
      value: this.value,
    };

    // Add the value factors if existed.
    if (this.factors.length > 0) paramState.factors = this.factors;

    // Add the rules for validation if existed.
    if (this.rules.length > 0) paramState.rules = this.rules;

    // Add param type if not constant.
    if (!this.isConstant) paramState.type = this.saveType();

    return paramState;
  }
}
