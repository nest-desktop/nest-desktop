import { Model } from './model';
import { ModelParameter } from './modelParameter';

export class ModelCompartmentParameter extends ModelParameter {
  constructor(model: Model, param: any) {
    super(model, param);
  }

  /**
   * Get the options from the model compartment component.
   */
  override get options(): ModelCompartmentParameter {
    const param: ModelCompartmentParameter = this.model.compartmentParams.find(
      (p: ModelCompartmentParameter) => p.id === this.id
    );
    return param;
  }
}
