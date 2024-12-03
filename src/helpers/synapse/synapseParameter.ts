// synapseParameter.ts

import { BaseParameter, IParamProps } from "@/helpers/common/parameter";
import { TSynapse } from "@/types";

export class BaseSynapseParameter extends BaseParameter {
  public _synapse: TSynapse;

  constructor(synapse: TSynapse, paramProps: IParamProps) {
    super(paramProps);
    this._synapse = synapse;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get types(): any[] {
    return this.config?.localStorage.types;
  }

  get parent(): TSynapse {
    return this.synapse;
  }

  /**
   * Serialize for JSON.
   * @return synapse parameter props
   */
  override toJSON(): IParamProps {
    const paramProps: IParamProps = {
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
