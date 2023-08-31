// norseModel.ts

import { BaseModel, ModelProps } from "@/common/model/baseModel";

export interface NorseModelProps extends ModelProps {}

export class NorseModel extends BaseModel {
  constructor(model: NorseModelProps = {}) {
    super(model, "NorseModel");
  }

  /**
   * Clone this model object.
   */
  override clone(): NorseModel {
    return new NorseModel({ ...this.toJSON() });
  }
}
