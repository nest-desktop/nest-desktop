// synapseParameter.ts

import { CodeMaskParameter } from "@/codeGraph";
import { type IParamState, type IParamType } from "@/parameter";

import { BaseSynapse } from "./synapse";
import type { SynapseParameters } from "./synapseParameters";

export class BaseSynapseParameter<
  TParent extends SynapseParameters = SynapseParameters,
> extends CodeMaskParameter<TParent> {
  get synapse(): BaseSynapse {
    return this.synapseParams.synapse;
  }

  get synapseParams(): TParent {
    return this.parent;
  }

  get types(): IParamType[] {
    return this.config?.localStorage.types;
  }

  /**
   * Save synapse parameter to state.
   * @return synapse parameter state
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
