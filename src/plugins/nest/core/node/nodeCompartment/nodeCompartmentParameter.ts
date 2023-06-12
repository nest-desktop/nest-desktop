// nodeCompartmentParameter.ts

import { NodeCompartment } from "./nodeCompartment";
import { NodeParameter, NodeParamProps } from "../nodeParameter";
import { ModelCompartmentParameter } from "../../model/modelCompartmentParameter";

export class NodeCompartmentParameter extends NodeParameter {
  constructor(nodeCompartment: NodeCompartment, param: NodeParamProps) {
    super(nodeCompartment, param);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelCompartmentParameter {
    return this.nodeCompartment.node.model.compartmentParams[this.id];
  }

  get nodeCompartment(): NodeCompartment {
    return this.parent as NodeCompartment;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.nodeCompartment.nodeChanges();
  }
}
