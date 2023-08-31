// modelCompartmentParameter.ts

import { Model } from "./model";
import { ModelParameter, ModelParameterProps } from "./modelParameter";

export interface ModelCompartmentalParameterProps extends ModelParameterProps {}

export class ModelCompartmentParameter extends ModelParameter {
  constructor(model: Model, param: ModelCompartmentalParameterProps) {
    super(model, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelCompartmentParameter {
    return this.model.compartmentParams[this.id];
  }
}
