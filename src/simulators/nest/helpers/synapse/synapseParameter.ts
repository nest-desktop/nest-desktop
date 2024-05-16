// synapseParameters.ts

import { ModelParameter } from "@/helpers/model/modelParameter";
import { Parameter, IParamProps } from "@/helpers/common/parameter";

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
