// nodeReceptorParameters.ts

import { ModelReceptorParameter } from "../../model/modelReceptor/modelReceptorParameter";
import { NodeParameter, NodeParamProps } from "../nodeParameter";
import { NodeReceptor } from "./nodeReceptor";

export interface NodeReceptorParameterProps extends NodeParamProps {}

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
  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.nodeReceptor.nodeChanges();
  }
}
