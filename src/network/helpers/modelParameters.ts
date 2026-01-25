// modelParameters.ts

import type { ModelParameter } from "@/model";
import type { TModel } from "@/types";
import { type BaseParameter, BaseParameters, type IParamState } from "@/parameter";

export class ModelParameters<TParameter extends BaseParameter = BaseParameter> extends BaseParameters<TParameter> {
  constructor() {
    super();
  }

  get model(): TModel | undefined {
    return;
  }

  get modelParams(): this {
    return this;
  }

  /**
   * Load parameters from state.
   * @param paramStates parameter states
   */
  override load(paramStates?: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();
    if (this.model) {
      this.model.params.entries.forEach(([modelId, modelParam]: [string, ModelParameter]) => {
        const modelParamState = modelParam.save();
        if (paramStates && paramStates) {
          const paramState = paramStates[modelId];
          if (paramState) {
            this.addParameter({
              ...paramState,
              ...modelParamState,
              id: modelId,
            });
          } else {
            this.addParameter({ ...modelParamState, id: modelId });
          }
        } else {
          this.addParameter({ ...modelParamState, id: modelId });
        }
      });
    } else if (paramStates) {
      Object.entries(paramStates).forEach(([paramKey, paramState]: [string, IParamState]) =>
        this.addParameter({ ...paramState, id: paramKey }),
      );
    }
  }
}
