// modelParameter.ts

import { Model } from "@/types/modelTypes";
import { Parameter, ParameterProps } from "@/helpers/parameter";

export interface ModelParameterProps extends ParameterProps {}

export class ModelParameter extends Parameter {
  private _parent: Model;

  constructor(model: Model, param: ModelParameterProps) {
    super(param);
    this._parent = model;
  }

  get model(): Model {
    return this._parent as Model;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  get parent(): Model {
    return this._parent;
  }

  get visible(): boolean {
    return this.model.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.model.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.model.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.model.paramsVisible = this.model.paramsVisible.filter(
        (paramId: string) => paramId !== this.id
      );
    }
  }

  /**
   * Observer for parameter changes.
   *
   * @remarks
   * It emits model changes.
   */
  override changes(): void {
    this._parent.changes();
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): ModelParameterProps {
    const param: ModelParameterProps = {
      id: this.id,
      variant: this.variant,
      label: this.label,
      unit: this.unit,
      value: this.value,
      // visible: this.visible as boolean,
    };

    if (this.variant === "valueSlider") {
      param.min = this.min;
      param.max = this.max;
      param.step = this.step;
    } else if (this.variant === "tickSlider") {
      param.ticks = this.ticks;
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    return param;
  }
}
