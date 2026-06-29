// copyModelParameters.ts

import { BaseParameters, type IParamState, type TParamValue } from "@/parameter";
import type { Class } from "@/types";
import type { ModelParameter, ModelParameters } from "@/model";

import type { NESTCopyModel } from "./copyModel";
import type { NESTNode } from "../node";
import { NESTCopyModelParameter } from "./copyModelParameter";

export class NESTCopyModelParameters extends BaseParameters<NESTCopyModelParameter> {
  public _copyModel: NESTCopyModel;

  constructor(copyModel: NESTCopyModel) {
    super();

    this._copyModel = copyModel;
  }

  override get Parameter(): Class<NESTCopyModelParameter> {
    return NESTCopyModelParameter;
  }

  get copyModel(): NESTCopyModel {
    return this._copyModel;
  }

  get hasSomeVisibleParams(): boolean {
    return this.visibleParamIds.length > 0 || this.hasWeightRecorderParam;
  }

  get hasWeightRecorderParam(): boolean {
    return this.hasParameter("weight_recorder");
  }

  get modelParams(): ModelParameters | undefined {
    return this.copyModel.model?.params;
  }

  override load(paramStates: Record<string, IParamState>): void {
    this.emptyParams();
    if (this.modelParams) {
      this.modelParams?.values.forEach((modelParam: ModelParameter) => {
        if (paramStates && paramStates.length > 0) {
          const modelParamState = paramStates.find((paramState: IParamState) => paramState.id === modelParam.id);
          if (modelParamState) {
            this.addParameter(
              {
                ...modelParamState,
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
      paramStates.forEach((param: IParamState) => this.addParameter(param, true));
    }

    if (this.isSynapse) {
      const weightRecorders = this.copyModel.network.nodes.weightRecorders.map(
        (recorder: NESTNode) => recorder.view.label,
      );
      let weightRecorder: TParamValue = weightRecorders[weightRecorders.length - 1];

      if (paramStates) {
        const weightRecorderParam = paramStates.find((paramState: IParamState) => paramState.id === "weight_recorder");
        if (weightRecorderParam && weightRecorderParam.value) weightRecorder = weightRecorderParam.value;
      }

      this.addParameter({
        id: "weight_recorder",
        items: this.copyModel.network.nodes.weightRecorders.map((recorder: NESTNode) => recorder.view.label),
        component: "select",
        label: "weight recorder",
        value: weightRecorder || null,
      });
    }
  }

  // /**
  //  * Observer for parameter changes.
  //  * @remarks It emits model changes.
  //  */
  // override changes(props = {}): void {
  //   this.logger.trace("changes");

  //   this.copyModel.changes(props);
  // }
}
