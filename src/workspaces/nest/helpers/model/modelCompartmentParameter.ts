// modelCompartmentParameter.ts

import { IParamProps } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";

import { NESTModel } from "./model";

export class NESTModelCompartmentParameter extends ModelParameter {
  constructor(model: NESTModel, param: IParamProps) {
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
