// copyModelParameter.ts

import { BaseParameter, BaseParameters, type IParamOptions, type IParamState } from "@/parameter";

import type { NESTModel } from "@/workspaces/nest/types";

export class NESTCopyModelParameter<TParent extends BaseParameters = BaseParameters> extends BaseParameter<TParent> {
  get copyModelParams(): TParent {
    return this.parent;
  }

  get isWeightRecorder(): boolean {
    return this.id === "weight_recorder";
  }

  get model(): NESTModel {
    return this.copyModelParams.copyModel.model as NESTModel;
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
