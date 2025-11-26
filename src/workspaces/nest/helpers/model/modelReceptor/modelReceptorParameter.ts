// modelReceptorParameter.ts

import { ModelParameter } from "@/helpers/model/modelParameter";

import type { NESTModel } from "../model";

export class NESTModelReceptorParameter extends ModelParameter {
  get model(): NESTModel {
    return this.modelParams.model as NESTModel;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params.get(this.id);
  }
}
