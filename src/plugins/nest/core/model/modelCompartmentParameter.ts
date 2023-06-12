// modelCompartmentalParameter.ts

import { Model } from "./model";
import { ModelParameter, modelParameterProps } from "./modelParameter";

export interface modelCompartmentalParameterProps extends modelParameterProps {
}

export class ModelCompartmentParameter extends ModelParameter {
  constructor(model: Model, param: modelCompartmentalParameterProps) {
    super(model, param);
  }

  /**
   * Get the options from the model compartment component.
   */
  override get options(): modelCompartmentalParameterProps {
    return this.model.compartmentParams[this.id].toJSON();
  }
}
