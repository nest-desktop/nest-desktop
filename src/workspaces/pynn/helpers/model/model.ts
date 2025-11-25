// model.ts

import { BaseModel, type IModelState, type IModelRecordState, type ModelParameter } from "@/helpers/model";

export interface IPyNNModelState extends IModelState {
  codeTemplate?: string;
}

export class PyNNModel extends BaseModel {
  private _codeTemplate: string = "";

  constructor(modelState: IPyNNModelState) {
    super(modelState, { name: "PyNNModel", workspace: "pynn" });

    if (modelState.codeTemplate) {
      this._codeTemplate = modelState.codeTemplate;
    }
  }

  get codeTemplate(): string {
    return this._codeTemplate;
  }

  set codeTemplate(value: string) {
    this._codeTemplate = value;
  }

  /**
   * Save pynn model to state.
   * @returns pynn model state
   */
  override save(): IPyNNModelState {
    const modelState: IPyNNModelState = {
      abbreviation: this.abbreviation,
      elementType: this.elementType,
      id: this.id,
      label: this.state.label,
      params: Object.values(this.params).map((param: ModelParameter) => param.save()),
      version: process.env.APP_VERSION,
    };

    // Add the states if provided.
    if (this.states.length > 0) modelState.states = this.states.map((state: IModelRecordState) => state.id);
    if (this.codeTemplate) modelState.codeTemplate = this.codeTemplate;

    return modelState;
  }
}
