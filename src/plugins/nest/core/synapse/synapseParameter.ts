// synapseParameters.ts

import { Parameter, ParameterProps } from "@/helpers/parameter";

import { ModelParameter } from "../model/modelParameter";
import { Synapse } from "./synapse";

export interface SynapseParameterProps extends ParameterProps {}

export class SynapseParameter extends Parameter {
  private _parent: Synapse;

  constructor(synapse: Synapse, param: SynapseParameterProps) {
    super(param);
    this._parent = synapse;
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  get isSpatial(): boolean {
    return this._parent.connection.isBothSpatial;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.parent.model.params[this.id];
  }

  get parent(): Synapse {
    return this._parent;
  }

  get types(): any[] {
    const types: any[] = this.config.types;
    return !this.isSpatial
      ? types.filter((type: any) => !type.id.startsWith("spatial"))
      : types;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this._parent.synapseChanges();
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
