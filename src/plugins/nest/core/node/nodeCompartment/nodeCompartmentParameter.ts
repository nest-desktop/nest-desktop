// nodeCompartmentParameter.ts

import { ModelCompartmentParameter } from "../../model/modelCompartmentParameter";
import { NodeCompartment } from "./nodeCompartment";
import { NodeParameter, NodeParameterProps } from "../nodeParameter";

export interface NodeCompartmentParameterProps extends NodeParameterProps {}

export class NodeCompartmentParameter extends NodeParameter {
  constructor(
    nodeCompartment: NodeCompartment,
    param: NodeCompartmentParameterProps
  ) {
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
}
