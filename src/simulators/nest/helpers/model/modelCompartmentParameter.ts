// modelCompartmentParameter.ts

import { ModelParameter, ModelParameterProps } from "@/helpers/model/modelParameter";

import { NESTModel } from "./model";

export interface NESTModelCompartmentParameterProps extends ModelParameterProps {}

export class NESTModelCompartmentParameter extends ModelParameter {
  constructor(model: NESTModel, param: NESTModelCompartmentParameterProps) {
    super(model, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelCompartmentParameter {
    const model = this.model as NESTModel;
    return model.compartmentParams[this.id];
  }
}
