// modelParameter.ts

import { BaseParameter, type IParamState } from "@/parameter";

import type { ModelParameters } from "./modelParameters";

export class ModelParameter<TParent extends ModelParameters = ModelParameters> extends BaseParameter<TParent> {
  override get modelParam(): ModelParameter {
    return this;
  }

  /**
   * Save model parameter to state.
   * @return parameter state
   */
  override save(): IParamState {
    const paramState: IParamState = super.save();

    // Add label if existed.
    if (this.label) paramState.label = this.label;

    if (this.unit) paramState.unit = this.unit;

    if (this.component) {
      paramState.component = this.component;
      if (this.component === "valueSlider") {
        paramState.min = this.min;
        paramState.max = this.max;
        paramState.step = this.step;
      } else if (this.component === "tickSlider") {
        paramState.ticks = this.ticks;
      }
    }

    return paramState;
  }
}
