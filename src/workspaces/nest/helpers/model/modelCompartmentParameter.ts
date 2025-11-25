// modelCompartmentParameter.ts

import { ModelParameter } from "@/helpers/model/modelParameter";

import type { NESTModel } from "./model";

export class NESTModelCompartmentParameter extends ModelParameter {
  constructor(model: NESTModel) {
    super(model);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelCompartmentParameter {
    const model = this.model as NESTModel;
    return model.compartmentParams[this.id];
  }
}
