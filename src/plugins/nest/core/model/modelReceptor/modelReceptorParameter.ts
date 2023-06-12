// modelReceptorParameters.ts

import { ModelParameter, ModelParameterProps } from "../modelParameter";
import { ModelReceptor } from "./modelReceptor";

export interface ModelReceptorParameterProps extends ModelParameterProps {}

export class ModelReceptorParameter extends ModelParameter {
  constructor(modelReceptor: ModelReceptor, param: ModelReceptorParameterProps) {
    super(modelReceptor, param);
  }

  /**
   * Get the options from the model receptor component.
   *
   * @remarks
   * TODO: Validate this options to get options for input.
   */
  override get options(): ModelReceptorParameterProps {
    return this.modelReceptor.params[this.id].toJSON();
  }

  get modelReceptor(): ModelReceptor {
    return this.parent as ModelReceptor;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.modelReceptor.modelChanges();
  }
}
