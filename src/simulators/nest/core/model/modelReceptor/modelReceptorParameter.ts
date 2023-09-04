// modelReceptorParameters.ts

import { ModelParameter, ModelParameterProps } from "../modelParameter";
import { ModelReceptor } from "./modelReceptor";

export interface ModelReceptorParameterProps extends ModelParameterProps {}

export class ModelReceptorParameter extends ModelParameter {
  constructor(
    modelReceptor: ModelReceptor,
    param: ModelReceptorParameterProps
  ) {
    super(modelReceptor, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelReceptorParameter {
    return this.modelReceptor.params[this.id];
  }

  get modelReceptor(): ModelReceptor {
    return this.parent as ModelReceptor;
  }
}
