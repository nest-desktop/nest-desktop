// copyModelParameter.ts

import { BaseParameter, type IParamOptions, type IParamState } from "@/helpers/common";
import { ModelParameter } from "@/helpers/model";
import type { TModel } from "@/types";

import { NESTCopyModel } from "./copyModel";

export class NESTCopyModelParameter extends BaseParameter {
  private _copyModel: NESTCopyModel;

  constructor(model: NESTCopyModel) {
    super();

    this._copyModel = model;
  }

  get copyModel(): NESTCopyModel {
    return this._copyModel;
  }

  get isWeightRecorder(): boolean {
    return this.id === "weight_recorder";
  }

  override get options(): IParamOptions {
    if (this.isWeightRecorder) {
      return {
        component: "select",
        defaultValue: "",
        id: "weight_recorder",
        label: "weight recorder",
        unit: "",
      };
    }

    const param = this.modelParam;
    const options: IParamOptions = {
      component: param.component || "",
      defaultValue: param.value,
      id: param.id,
      label: param.label,
      unit: param.unit,
    };

    if (["rangeSlider", "valueSlider"].includes(param.component)) {
      options.max = param.max;
      options.min = param.min;
      options.step = param.step;
    }

    if (param.component === "tickSlider") {
      options.tickLabels = param.ticks;
    }

    return options;
  }

  get model(): TModel {
    return this._copyModel.model as TModel;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter | undefined {
    return this.model.params[this.id];
  }

  override get parent(): NESTCopyModel {
    return this.copyModel;
  }

  override set visible(value: boolean) {
    const isVisible = this.parent.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.parent.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.parent.paramsVisible = this.parent.paramsVisible.filter((paramId: string) => paramId !== this.id);
    }
  }

  /**
   * Save model parameter to state.
   * @return model parameter state
   */
  override save(): IParamState {
    const paramState: IParamState = {
      id: this.id,
      // component: this.component,
      // label: this.label,
      // unit: this.unit,
      value: this.value,
      // visible: this.visible as boolean,
    };

    // if (this.component === "valueSlider") {
    //   paramState.min = this.min;
    //   paramState.max = this.max;
    //   paramState.step = this.step;
    // } else if (this.component === "tickSlider") {
    //   paramState.ticks = this.ticks;
    // }

    // // Add rules for validation if existed.
    // if (this.rules.length > 0) paramState.rules = this.rules;

    return paramState;
  }
}
