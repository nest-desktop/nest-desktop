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
    return types;
  }

  get visible(): boolean {
    return this.synapse.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.synapse.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.synapse.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.synapse.paramsVisible = this.synapse.paramsVisible.filter(
        (paramId: string) => paramId !== this.id
      );
    }
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
    this.visible = false;
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
