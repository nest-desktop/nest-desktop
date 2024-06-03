// modelReceptorParameters.ts

import {
  IModelParamProps,
  ModelParameter,
} from "@/helpers/model/modelParameter";

import { NESTModelReceptor } from "./modelReceptor";

export interface INESTModelReceptorParamProps extends IModelParamProps {}

export class NESTModelReceptorParameter extends ModelParameter {
  constructor(
    modelReceptor: NESTModelReceptor,
    paramProps: INESTModelReceptorParamProps
  ) {
    super(modelReceptor.model, paramProps);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }
}
