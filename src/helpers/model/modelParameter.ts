// modelParameter.ts

import { BaseParameter, type IParamState } from "../common";
import { ModelParameters } from "./modelParameters";

export class ModelParameter extends BaseParameter {
  private _modelParams: ModelParameters;

  constructor(modelParams: ModelParameters) {
    super();
    this._modelParams = modelParams;
  }

  get modelParams(): ModelParameters {
    return this._modelParams;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter | undefined {
    return this.modelParams.model.params.get(this.id);
  }

  override get parent(): ModelParameters {
    return this.modelParams;
  }

  /**
   * Save model parameter to state.
   * @return parameter state
   */
  override save(): IParamState {
    const paramState: IParamState = {
      id: this.id,
      label: this.label,
      value: this.value,
      // visible: this.visible as boolean,
    };

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

    // Add rules for validation if existed.
    if (this.rules.length > 0) paramState.rules = this.rules;

    return paramState;
  }
}
