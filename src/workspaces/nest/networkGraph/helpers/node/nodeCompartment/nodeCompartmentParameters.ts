// nodeParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { ModelParameter } from "@/helpers/model";
import type { Class } from "@/types";
import type { ModelParameters } from "@/helpers/model/modelParameters";

import { NESTNodeCompartment } from "./nodeCompartment";
import { NESTNodeCompartmentParameter } from "./nodeCompartmentParameter";

export class NESTNodeCompartmentParameters extends BaseParameters {
  public _nodeCompartment: NESTNodeCompartment;

  constructor(nodeCompartment: NESTNodeCompartment) {
    super();

    this._nodeCompartment = nodeCompartment;
  }

  override get Parameter(): Class<NESTNodeCompartmentParameter> {
    return NESTNodeCompartmentParameter;
  }

  get modelParams(): ModelParameters {
    return this.nodeCompartment.model.params;
  }

  get nodeCompartment(): NESTNodeCompartment {
    return this._nodeCompartment;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.nodeCompartment.changes(props);
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
