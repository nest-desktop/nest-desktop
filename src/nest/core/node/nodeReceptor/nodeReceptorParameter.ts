// nodeReceptorParameters.ts

import { ModelReceptorParameter } from "../../model/modelReceptor/modelReceptorParameter";
import { NodeParameter, NodeParameterProps } from "../nodeParameter";
import { NodeReceptor } from "./nodeReceptor";

export interface NodeReceptorParameterProps extends NodeParameterProps {}

export class NodeReceptorParameter extends NodeParameter {
  constructor(nodeReceptor: NodeReceptor, param: NodeReceptorParameterProps) {
    super(nodeReceptor, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelReceptorParameter {
    return this.nodeReceptor.model.params[this.id];
  }

  get nodeReceptor(): NodeReceptor {
    return this.parent as NodeReceptor;
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
