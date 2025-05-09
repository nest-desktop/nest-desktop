// synapseParameter.ts

import { BaseSynapseParameter } from "@/helpers/synapse/synapseParameter";
import { IParamProps } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";

import { NESTCopyModelParameter } from "../model/copyModelParameter";
import { NESTSynapse } from "./synapse";

export class NESTSynapseParameter extends BaseSynapseParameter {
  constructor(synapse: NESTSynapse, paramProps: IParamProps) {
    super(synapse, paramProps);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter | NESTCopyModelParameter {
    return this.synapse.model.params[this.id];
  }

  override get synapse(): NESTSynapse {
    return this._synapse as NESTSynapse;
  }

  override get types(): any[] {
    const types: any[] = this.config?.localStorage.types;
    return !this.synapse.isSpatial ? types.filter((type: any) => !type.id.startsWith("spatial")) : types;
  }

  override get parent(): NESTSynapse {
    return this.synapse;
  }

  /**
   * Serialize for JSON.
   * @return parameter props
   */
  override toJSON(): IParamProps {
    const paramProps: IParamProps = {
      id: this.id,
      value: this.value,
    };

    // Add the value factors if existed.
    if (this.factors.length > 0) paramProps.factors = this.factors;

    // Add the rules for validation if existed.
    if (this.rules.length > 0) paramProps.rules = this.rules;

    // Add param type if not constant.
    if (!this.isConstant) paramProps.type = this.typeToJSON();

    return paramProps;
  }
}
