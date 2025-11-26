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

  get visible(): boolean {
    return this.nodeReceptorParams.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.nodeReceptorParams.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.nodeReceptorParams.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.nodeReceptorParams.paramsVisible = this.nodeReceptorParams.paramsVisible.filter(
        (paramId: string) => paramId !== this.id,
      );
    }
  }
}
