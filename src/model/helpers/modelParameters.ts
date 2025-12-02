// modelParameters.ts

import type { Class } from "@/types";
import { BaseParameters } from "@/parameter";

import type { BaseModel } from "../model";
import { ModelParameter } from "./modelParameter";

export class ModelParameters<TModel extends BaseModel = BaseModel> extends BaseParameters<ModelParameter> {
  public _model: TModel;

  constructor(model: TModel) {
    super();

    this._model = model;
  }

  override get Parameter(): Class<ModelParameter> {
    return ModelParameter;
  }

  get modelParams(): this {
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
