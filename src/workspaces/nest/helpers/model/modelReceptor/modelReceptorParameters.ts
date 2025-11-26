// modelParameters.ts

import { BaseParameters } from "@/helpers/common";
import type { Class } from "@/types";

import type { NESTModelReceptor } from "./modelReceptor";
import { NESTModelReceptorParameter } from "./modelReceptorParameter";

export class NESTModelReceptorParameters extends BaseParameters {
  public _modelReceptor: NESTModelReceptor;

  constructor(modelReceptor: NESTModelReceptor) {
    super();

    this._modelReceptor = modelReceptor;
  }

  override get Parameter(): Class<NESTModelReceptorParameter> {
    return NESTModelReceptorParameter;
  }

  get modelParams(): NESTModelReceptorParameters {
    return this;
  }

  get modelReceptor(): NESTModelReceptor {
    return this._modelReceptor;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits model receptor changes.
   */
  override changes(): void {
    this.logger.trace("changes");

    this.modelReceptor.changes();
  }
}
