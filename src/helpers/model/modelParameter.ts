// modelParameter.ts

import { TModel } from "@/types";

import { BaseParameter, IParamProps } from "../common/parameter";

export class ModelParameter extends BaseParameter {
  private _model: TModel;

  constructor(model: TModel, paramProps: IParamProps) {
    super(paramProps, { minLevel: 3 });
    this._model = model;
  }

  get model(): TModel {
    return this._model;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  override get parent(): TModel {
    return this.model;
  }

  /**
   * Serialize for JSON.
   * @return parameter object
   */
  override toJSON(): IParamProps {
    const paramProps: IParamProps = {
      id: this.id,
      label: this.label,
      value: this.value,
      // visible: this.visible as boolean,
    };

    if (this.unit) paramProps.unit = this.unit;

    if (this.component) {
      paramProps.component = this.component;
      if (this.component === "valueSlider") {
        paramProps.min = this.min;
        paramProps.max = this.max;
        paramProps.step = this.step;
      } else if (this.component === "tickSlider") {
        paramProps.ticks = this.ticks;
      }
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) paramProps.rules = this.rules;

    return paramProps;
  }
}
