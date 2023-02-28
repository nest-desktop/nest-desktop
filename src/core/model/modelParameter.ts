import { CopyModel } from './copyModel';
import { Model } from './model';
import { ModelReceptor } from './modelReceptor/modelReceptor';
import { Parameter } from '../parameter/parameter';

type modelTypes = CopyModel | Model | ModelReceptor;

export class ModelParameter extends Parameter {
  constructor(model: modelTypes, param: any) {
    super(model, param);
  }

  get model(): Model {
    return this.parent as Model;
  }

  /**
   * Get the options from the model component.
   */
  override get options(): ModelParameter {
    const param: ModelParameter = this.model
      ? this.model.params.find((p: ModelParameter) => p.id === this.id)
      : undefined;
    return param;
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
  override toJSON(): any {
    const param: any = {
      id: this.id,
      input: this.input,
      label: this.label,
      unit: this.unit,
      value: this.value,
      visible: this.state.visible as boolean,
    };

    if (this.input === 'valueSlider') {
      param.min = this.min;
      param.max = this.max;
      param.step = this.step;
    } else if (this.input === 'tickSlider') {
      param.ticks = this.ticks;
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    return param;
  }
}
