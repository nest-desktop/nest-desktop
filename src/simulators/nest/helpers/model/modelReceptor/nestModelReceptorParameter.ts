// nestModelReceptorParameters.ts

import {
  ModelParameter,
  ModelParameterProps,
} from "@/helpers/model/modelParameter";

import { NESTModelReceptor } from "./nestModelReceptor";
import { NESTModel } from "../nestModel";

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
