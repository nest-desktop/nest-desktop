// modelReceptorParameters.ts

import type { IParamState } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";

import { NESTModelReceptor } from "./modelReceptor";

export class NESTModelReceptorParameter extends ModelParameter {
  constructor(modelReceptor: NESTModelReceptor, paramState: IParamState) {
    super(modelReceptor.model, paramState);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }
}
