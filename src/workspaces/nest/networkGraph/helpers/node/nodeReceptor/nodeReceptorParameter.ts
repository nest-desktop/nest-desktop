// nodeReceptorParameters.ts

import { BaseParameter } from "@/helpers/common";

import { NESTModelReceptorParameter } from "../../../../helpers/model/modelReceptor/modelReceptorParameter";
import { NESTNodeReceptorParameters } from "./nodeReceptorParameters";

export class NESTNodeReceptorParameter extends BaseParameter {
  private _nodeReceptorParams: NESTNodeReceptorParameters;

  constructor(nodeReceptorParams: NESTNodeReceptorParameters) {
    super();

    this._nodeReceptorParams = nodeReceptorParams;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelReceptorParameter {
    return this.nodeReceptorParams.nodeReceptor.model.params.get(this.id);
  }

  get nodeReceptorParams(): NESTNodeReceptorParameters {
    return this._nodeReceptorParams as NESTNodeReceptorParameters;
  }
}
