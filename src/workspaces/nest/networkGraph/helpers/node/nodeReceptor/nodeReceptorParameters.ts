// nodeParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { ModelParameter } from "@/helpers/model";
import type { Class } from "@/types";
import type { ModelParameters } from "@/helpers/model/modelParameters";

import { NESTNodeReceptor } from "./nodeReceptor";
import { NESTNodeReceptorParameter } from "./nodeReceptorParameter";

export class NESTNodeReceptorParameters extends BaseParameters {
  public _nodeReceptor: NESTNodeReceptor;

  constructor(nodeReceptor: NESTNodeReceptor) {
    super();

    this._nodeReceptor = nodeReceptor;
  }

  override get Parameter(): Class<NESTNodeReceptorParameter> {
    return NESTNodeReceptorParameter;
  }

  get modelParams(): ModelParameters {
    return this.nodeReceptor.model.params;
  }

  get nodeReceptor(): NESTNodeReceptor {
    return this._nodeReceptor;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.nodeReceptor.changes(props);
  }

  /**
   * Load node parameters from state.
   * @param paramStates node receptor parameter states
   */
  override load(paramStates?: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();
    if (this.nodeReceptor.model) {
      this.modelParams.values.forEach((modelParam: ModelParameter) => {
        if (paramStates && paramStates) {
          const nodeParamState = paramStates[modelParam.id];
          if (nodeParamState) {
            this.addParameter(
              {
                ...nodeParamState,
                ...modelParam,
              },
              true,
            );
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (paramStates) {
      Object.entries(paramStates).forEach(([paramKey, param]: [string, IParamState]) =>
        this.addParameter({ ...param, id: paramKey }, true),
      );
    }
  }
}
