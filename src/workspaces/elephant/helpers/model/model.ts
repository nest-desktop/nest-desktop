// model.ts

import { BaseModel, IModelProps, IModelStateProps } from "@/helpers/model/model";
import { ModelParameter } from "@/helpers/model/modelParameter";

export interface IElephantModelProps extends IModelProps {
  codeTemplate?: string;
}

export class ElephantModel extends BaseModel {
  private _codeTemplate: string = "";

  constructor(modelProps: IElephantModelProps) {
    super(modelProps);

    if (modelProps.codeTemplate) {
      this._codeTemplate = modelProps.codeTemplate;
    }
  }

  get codeTemplate(): string {
    return this._codeTemplate;
  }

  set codeTemplate(value: string) {
    this._codeTemplate = value;
  }

  /**
   * Serialize to JSON.
   * @returns elephant model props
   */
  override toJSON(): IElephantModelProps {
    const modelProps: IElephantModelProps = {
      abbreviation: this.abbreviation,
      elementType: this.elementType,
      id: this.id,
      label: this.state.label,
      params: Object.values(this.params).map((param: ModelParameter) => param.toJSON()),
      version: process.env.APP_VERSION,
    };

    // Add the states if provided.
    if (this.states.length > 0) modelProps.states = this.states.map((state: IModelStateProps) => state.id);
    if (this.codeTemplate) modelProps.codeTemplate = this.codeTemplate;

    return modelProps;
  }
}
