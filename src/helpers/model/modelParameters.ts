// modelParameters.ts

import { BaseParameters } from "@/helpers/common";
import type { Class, TModel } from "@/types";

import { ModelParameter } from "./modelParameter";

export class ModelParameters extends BaseParameters {
  public _model: TModel;

  constructor(model: TModel) {
    super();

    this._model = model;
  }

  override get Parameter(): Class<ModelParameter> {
    return ModelParameter;
  }

  get modelParams(): ModelParameters {
    return this;
  }

  get model(): TModel {
    return this._model;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits model changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.model.changes(props);
  }
}
