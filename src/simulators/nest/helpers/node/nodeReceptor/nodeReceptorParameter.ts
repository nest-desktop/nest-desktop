// nodeReceptorParameters.ts

import {
  NodeParameter,
  NodeParameterProps,
} from "@/helpers/node/nodeParameter";

import { NESTModelReceptorParameter } from "../../model/modelReceptor/modelReceptorParameter";

import { NESTNodeReceptor } from "./nodeReceptor";

export interface NESTNodeReceptorParameterProps extends NodeParameterProps {}

export class NESTNodeReceptorParameter extends NodeParameter {
  constructor(
    nodeReceptor: NESTNodeReceptor,
    param: NESTNodeReceptorParameterProps
  ) {
    super(nodeReceptor, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelReceptorParameter {
    return this.nodeReceptor.model.params[this.id];
  }

  get nodeReceptor(): NESTNodeReceptor {
    return this._node as NESTNodeReceptor;
  }

  get visible(): boolean {
    return this.nodeReceptor.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.nodeReceptor.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.nodeReceptor.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.nodeReceptor.paramsVisible = this.nodeReceptor.paramsVisible.filter(
        (paramId: string) => paramId !== this.id
      );
    }
  }
}
