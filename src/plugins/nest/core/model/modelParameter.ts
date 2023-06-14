// modelParameter.ts

import { Parameter, ParameterProps } from '@/helpers/parameter';

import { CopyModel } from './copyModel';
import { Model } from './model';
import { ModelReceptor } from './modelReceptor/modelReceptor';

type modelTypes = CopyModel | Model | ModelReceptor;

export interface ModelParameterProps extends ParameterProps {}

export class ModelParameter extends Parameter {
  private _parent: modelTypes;

  constructor(model: modelTypes, param: ModelParameterProps) {
    super(param);
    this._parent = model;
  }

  get model(): Model {
    return this._parent as Model
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  get parent(): modelTypes {
    return this._parent;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.parent.modelChanges();
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): ModelParameterProps {
    const param: ModelParameterProps = {
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
