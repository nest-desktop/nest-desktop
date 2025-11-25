// model.ts

import { BaseModel, ModelParameter, type IModelRecordState, type IModelState } from "@/helpers/model";

export interface INorseModelState extends IModelState {
  codeTemplate?: string;
}

export class NorseModel extends BaseModel {
  private _codeTemplate: string = "";

  constructor(modelState: INorseModelState) {
    super(modelState, { name: "NorseModel", workspace: "norse" });

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
   * Save norse model to state.
   * @returns norse model state
   */
  override save(): INorseModelState {
    const modelState: INorseModelState = {
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
