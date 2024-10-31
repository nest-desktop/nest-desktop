// modelCompartmentParameter.ts

import {
  IModelParamProps,
  ModelParameter,
} from "@/helpers/model/modelParameter";

import { NESTModel } from "./model";

export interface INESTModelCompartmentParamProps extends IModelParamProps {}

export class NESTModelCompartmentParameter extends ModelParameter {
  constructor(model: NESTModel, param: INESTModelCompartmentParamProps) {
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
