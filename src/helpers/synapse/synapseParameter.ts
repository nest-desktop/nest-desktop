// synapseParameter.ts

import { IParamProps, Parameter } from "@/helpers/common/parameter";
import { TSynapse } from "@/types";

export interface ISynapseParamProps extends IParamProps {}

export class BaseSynapseParameter extends Parameter {
  public _synapse: TSynapse;

  constructor(synapse: TSynapse, paramProps: ISynapseParamProps) {
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
