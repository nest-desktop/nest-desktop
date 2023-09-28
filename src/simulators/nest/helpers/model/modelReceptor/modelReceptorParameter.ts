// modelReceptorParameters.ts

import {
  ModelParameter,
  ModelParameterProps,
} from "@/helpers/model/modelParameter";

import { NESTModelReceptor } from "./modelReceptor";
import { NESTModel } from "../model";

export interface NESTModelReceptorParameterProps extends ModelParameterProps {}

export class NESTModelReceptorParameter extends ModelParameter {
  constructor(
    modelReceptor: NESTModelReceptor,
    param: NESTModelReceptorParameterProps
  ) {
    super(modelReceptor.model, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  get model(): NESTModel {
    return this.parent as NESTModel;
  }
}
