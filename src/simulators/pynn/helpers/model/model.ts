// model.ts

import { BaseModel, IModelProps } from "@/helpers/model/model";
import { ModelParameter } from "@/helpers/model/modelParameter";

export interface IPyNNModelProps extends IModelProps {
  codeTemplate?: string;
}

export class PyNNModel extends BaseModel {
  private _codeTemplate: string = "";

  constructor(modelProps: IPyNNModelProps) {
    super(modelProps, { name: "PyNNModel", simulator: "pynn" });

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
   */
  override clone(): PyNNModel {
    return new PyNNModel({ ...this.toJSON() });
  }

  toJSON(): IPyNNModelProps {
    const modelProps: IPyNNModelProps = {
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
      modelProps.recordables = this.recordables.map(
        (recordable: any) => recordable.id
      );
    }

    if (this.codeTemplate) {
      modelProps.codeTemplate = this.codeTemplate;
    }

    return modelProps;
  }
}
