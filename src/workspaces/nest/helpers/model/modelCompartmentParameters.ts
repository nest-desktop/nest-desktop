// nodeParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { ModelParameter } from "@/helpers/model";
import type { Class } from "@/types";

import { NESTModel } from "./model";
import { NESTModelCompartmentParameter } from "./modelCompartmentParameter";

export class NESTModelCompartmentParameters extends BaseParameters {
  public _model: NESTModel;

  constructor(model: NESTModel) {
    super();

    this._model = model;
  }

  override get Parameter(): Class<NESTModelCompartmentParameter> {
    return NESTModelCompartmentParameter;
  }

  get modelParams(): NESTModelCompartmentParameters {
    return this;
  }

  get model(): NESTModel {
    return this._model;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.model.changes(props);
  }

  /**
   * Load node parameters from state.
   * @param paramStates node receptor parameter states
   */
  override load(paramStates: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    if (this.modelParams) {
      this.modelParams.values.forEach((modelParam: ModelParameter) => {
        this.addParameter(paramStates[modelParam.id] || modelParam.save());
      });
    } else {
      Object.values(paramStates).forEach((paramState: IParamState) => this.addParameter(paramState));
    }
  }
}
