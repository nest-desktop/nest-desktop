// copyModelParameter.ts

import { BaseParameter, type IParamOptions, type IParamState } from "@/helpers/common";
import type { TModel } from "@/types";

import { NESTCopyModelParameters } from "./copyModelParameters";

export class NESTCopyModelParameter extends BaseParameter {
  private _copyModelParams: NESTCopyModelParameters;

  constructor(modelParams: NESTCopyModelParameters) {
    super();

    this._copyModelParams = modelParams;
  }

  get copyModelParams(): NESTCopyModelParameters {
    return this._copyModelParams;
  }

  get isWeightRecorder(): boolean {
    return this.id === "weight_recorder";
  }

  get model(): TModel {
    return this.copyModelParams.copyModel.model as TModel;
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

  override get parent(): NESTCopyModelParameters {
    return this.copyModelParams;
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
