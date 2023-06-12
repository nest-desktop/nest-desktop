// synapseParameters.ts

import { ModelParameter } from '../model/modelParameter';
import { Parameter } from '../parameter';
import { Synapse } from './synapse';

export class SynapseParameter extends Parameter {
  constructor(synapse: Synapse, param: any) {
    super(synapse, param);
  }

  get synapse(): Synapse {
    return this.parent as Synapse;
  }

  /**
   * Get the options from the model component.
   */
  override get options(): ModelParameter | undefined {
    const param: ModelParameter | undefined = this.synapse.model
      ? this.synapse.model.params[this.id]
      : undefined;
    return param;
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
