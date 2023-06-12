import { CopyModel } from "./copyModel";
import { Model } from "./model";
import { ModelReceptor } from "./modelReceptor/modelReceptor";
import { Parameter, parameterProps } from "../parameter";

type modelTypes = CopyModel | Model | ModelReceptor;

export interface modelParameterProps extends parameterProps {}

export class ModelParameter extends Parameter {
  constructor(model: modelTypes, param: modelParameterProps) {
    super(model, param);
  }

  get model(): Model {
    return this.parent as Model;
  }

  /**
   * Get the options for vue component.
   */
  override get options(): modelParameterProps {
    return this.model.params[this.id].toJSON();
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.model.modelChanges();
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): modelParameterProps {
    const param: modelParameterProps = {
      id: this.id,
      input: this.input,
      label: this.label,
      unit: this.unit,
      value: this.value,
      visible: this.state.visible as boolean,
    };

    if (this.input === "valueSlider") {
      param.min = this.min;
      param.max = this.max;
      param.step = this.step;
    } else if (this.input === "tickSlider") {
      param.ticks = this.ticks;
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    return param;
  }
}
