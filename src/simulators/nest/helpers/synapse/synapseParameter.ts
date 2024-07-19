// synapseParameters.ts

import { IParamProps, Parameter } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";

import { NESTSynapse } from "./synapse";

export interface ISynapseParamProps extends IParamProps {}

export class NESTSynapseParameter extends Parameter {
  private _synapse: NESTSynapse;

  constructor(synapse: NESTSynapse, paramProps: ISynapseParamProps) {
    super(paramProps);
    this._synapse = synapse;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this._synapse.model.params[this.id];
  }

  get synapse(): NESTSynapse {
    return this._synapse;
  }

  get types(): any[] {
    const types: any[] = this.config?.localStorage.types;
    return !this.synapse.isSpatial
      ? types.filter((type: any) => !type.id.startsWith("spatial"))
      : types;
  }

  get parent(): NESTSynapse {
    return this.synapse;
  }

  /**
   * Serialize for JSON.
   * @return synapse parameter props
   */
  override toJSON(): ISynapseParamProps {
    const paramProps: ISynapseParamProps = {
      id: this.id,
      value: this.value,
    };

    // Add the value factors if existed.
    if (this.factors.length > 0) {
      paramProps.factors = this.factors;
    }

    // Add the rules for validation if existed.
    if (this.rules.length > 0) {
      paramProps.rules = this.rules;
    }

    // Add param type if not constant.
    if (!this.isConstant) {
      paramProps.type = this.typeToJSON();
    }

    return paramProps;
  }
}
