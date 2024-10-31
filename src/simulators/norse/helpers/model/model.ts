// model.ts

import { BaseModel, IModelProps } from "@/helpers/model/model";
import { ModelParameter } from "@/helpers/model/modelParameter";

export interface INorseModelProps extends IModelProps {
  codeTemplate?: string;
}

export class NorseModel extends BaseModel {
  private _codeTemplate: string = "";

  constructor(modelProps: INorseModelProps) {
    super(modelProps, { name: "NorseModel", simulator: "norse" });

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
   * Clone this model object.
   * @returns norse model object
   */
  override clone(): NorseModel {
    return new NorseModel({ ...this.toJSON() });
  }

  /**
   * Serialize to JSON.
   * @returns norse model props
   */
  toJSON(): INorseModelProps {
    const modelProps: INorseModelProps = {
      abbreviation: this.abbreviation,
      elementType: this.elementType,
      id: this.id,
      label: this.state.label,
      params: Object.values(this.params).map((param: ModelParameter) =>
        param.toJSON()
      ),
      version: process.env.APP_VERSION,
    };

    // Add the recordables if provided.
    if (this.state.recordables.length > 0) {
      modelProps.recordables = this.state.recordables.map(
        (recordable: any) => recordable.id
      );
    }

    if (this.codeTemplate) {
      modelProps.codeTemplate = this.codeTemplate;
    }

    return modelProps;
  }
}
