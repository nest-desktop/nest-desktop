// synapseParameters.ts

import { ModelParameter } from "../model/modelParameter";
import { Parameter, ParameterProps } from "../parameter";
import { Synapse } from "./synapse";

export interface SynapseParameterProps extends ParameterProps {}

export class SynapseParameter extends Parameter {
  constructor(synapse: Synapse, param: SynapseParameterProps) {
    super(synapse, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.synapse.model.params[this.id];
  }

  get synapse(): Synapse {
    return this.parent as Synapse;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.synapse.synapseChanges();
  }

  /**
   * Serialize for JSON.
   * @return synapse parameter object
   */
  override toJSON(): any {
    const param: any = {
      id: this.id,
      value: this.value,
      visible: this.state.visible,
    };

    // Add the value factors if existed.
    if (this.factors.length > 0) {
      param.factors = this.factors;
    }

    // Add the rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    // Add param type if not constant.
    if (!this.isConstant) {
      param.type = this.typeToJSON();
    }

    return param;
  }
}
