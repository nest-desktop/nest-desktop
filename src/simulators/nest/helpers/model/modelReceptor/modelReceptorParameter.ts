// modelReceptorParameters.ts

import { IParamProps } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";

import { NESTModelReceptor } from "./modelReceptor";

export class NESTModelReceptorParameter extends ModelParameter {
  constructor(
    modelReceptor: NESTModelReceptor,
    paramProps: IParamProps
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
