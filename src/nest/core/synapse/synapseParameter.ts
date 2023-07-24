// synapseParameters.ts

import { Parameter, ParameterProps } from "@/helpers/parameter";

import { ModelParameter } from "../model/modelParameter";
import { Synapse } from "./synapse";

export interface SynapseParameterProps extends ParameterProps {}

export class SynapseParameter extends Parameter {
  private _synapse: Synapse;

  constructor(synapse: Synapse, param: SynapseParameterProps) {
    super(param);
    this._synapse = synapse;
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  get isSpatial(): boolean {
    return this._synapse.connection.isBothSpatial;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this._synapse.model.params[this.id];
  }

  get synapse(): Synapse {
    return this._synapse;
  }

  get types(): any[] {
    const types: any[] = this.config.types;
    return !this.isSpatial
      ? types.filter((type: any) => !type.id.startsWith("spatial"))
      : types;
  }

  /**
   * Observer for parameter changes.
   *
   * @remarks
   * It emits synapse changes.
   */
  override changes(): void {
    this._synapse.changes();
  }

  /**
   * Hide this parameter.
   */
  hide(): void {
    this.synapse.paramsVisible = this.synapse.paramsVisible.filter(
      (item) => item !== this.id
    );
  }

  /**
   * Serialize for JSON.
   * @return synapse parameter object
   */
  override toJSON(): any {
    const param: any = {
      id: this.id,
      value: this.value,
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
