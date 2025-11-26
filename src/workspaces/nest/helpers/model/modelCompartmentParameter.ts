// modelCompartmentParameter.ts

import { BaseParameter } from "@/helpers/common";

import type { NESTModel } from "./model";
import type { NESTModelCompartmentParameters } from "./modelCompartmentParameters";

export class NESTModelCompartmentParameter extends BaseParameter {
  private _modelCompartmentParams: NESTModelCompartmentParameters;

  constructor(modelCompartmentParams: NESTModelCompartmentParameters) {
    super();

    this._modelCompartmentParams = modelCompartmentParams;
  }

  get model(): NESTModel {
    return this.modelParams.model as NESTModel;
  }

  get modelParams(): NESTModelCompartmentParameters {
    return this._modelCompartmentParams;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelCompartmentParameter {
    return this.model.compartmentParams.get(this.id);
  }
}
