// model.ts

import { BaseModel, ModelProps } from "@/helpers/model/model";
import { ModelParameter } from "@/helpers/model/modelParameter";

export interface NorseModelProps extends ModelProps {
  codeTemplate?: string;
}

export class NorseModel extends BaseModel {
  private _codeTemplate: string = "";

  constructor(model: NorseModelProps = {}) {
    super(model, "NorseModel");

    if (model.codeTemplate) {
      this._codeTemplate = model.codeTemplate;
    }
  }

  get codeTemplate(): string {
    return this._codeTemplate;
  }

  set codeTemplate(value: string) {
    this._codeTemplate = value;
  }

  /**
   * Clone this model object.
   */
  override clone(): NorseModel {
    return new NorseModel({ ...this.toJSON() });
  }

  toJSON(): NorseModelProps {
    const model: any = {
      abbreviation: this.abbreviation,
      elementType: this.elementType,
      id: this.id,
      label: this.label,
      params: Object.values(this.params).map((param: ModelParameter) =>
        param.toJSON()
      ),
      version: process.env.APP_VERSION,
    };

    // Add the recordables if provided.
    if (this.recordables.length > 0) {
      model.recordables = this.recordables.map(
        (recordable: any) => recordable.id
      );
    }

    if (this.codeTemplate) {
      model.codeTemplate = this.codeTemplate;
    }

    return model;
  }
}
