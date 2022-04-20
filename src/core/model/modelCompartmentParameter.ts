import { Model } from './model';
import { Parameter } from '../parameter/parameter';

export class ModelCompartmentParameter extends Parameter {
  constructor(model: Model, param: any) {
    super(model, param);
  }

  get model(): Model {
    return this.parent as Model;
  }

  /**
   * Get options from model compartment component.
   */
  override get options(): ModelCompartmentParameter {
    const param: ModelCompartmentParameter = this.model.compartmentParams.find(
      (p: ModelCompartmentParameter) => p.id === this.id
    );
    return param;
  }

  /**
   * Reset constant value taken from model component.
   */
  override reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Trigger changes when parameter is changed.
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
      value: this.value,
    };

    param.input = this.input;
    param.label = this.label;
    param.unit = this.unit;
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
