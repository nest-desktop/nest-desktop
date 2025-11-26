// synapseParameter.ts

import { BaseParameter, type IParamState, type IParamType } from "@/helpers/common";
import type { SynapseParameters } from "./synapseParameters";
import type { ModelParameter } from "@/helpers/model";
import { BaseSynapse } from "./synapse";

export class BaseSynapseParameter extends BaseParameter {
  public _synapseParams: SynapseParameters;

  constructor(synapseParams: SynapseParameters) {
    super();

    this._synapseParams = synapseParams;
  }

  override get modelParam(): ModelParameter | undefined {
    return this.synapse.model.params.get(this.id);
  }

  get synapse(): BaseSynapse {
    return this.synapseParams.synapse;
  }

  get synapseParams(): SynapseParameters {
    return this._synapseParams;
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
