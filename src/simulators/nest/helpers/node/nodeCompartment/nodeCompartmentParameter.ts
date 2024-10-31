// nodeCompartmentParameter.ts

import { INodeParamProps, NodeParameter } from "@/helpers/node/nodeParameter";

import { NESTModelCompartmentParameter } from "../../model/modelCompartmentParameter";
import { NESTNodeCompartment } from "./nodeCompartment";

export interface INESTNodeCompartmentParamProps extends INodeParamProps {}

export class NESTNodeCompartmentParameter extends NodeParameter {
  constructor(
    nodeCompartment: NESTNodeCompartment,
    paramProps: INESTNodeCompartmentParamProps
  ) {
    super(nodeCompartment, paramProps);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelCompartmentParameter {
    return this.nodeCompartment.node.model.compartmentParams[this.id];
  }

  get nodeCompartment(): NESTNodeCompartment {
    return this._node as NESTNodeCompartment;
  }

  get visible(): boolean {
    return this.nodeCompartment.node.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.nodeCompartment.node.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.nodeCompartment.node.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.nodeCompartment.node.paramsVisible =
        this.nodeCompartment.node.paramsVisible.filter(
          (paramId: string) => paramId !== this.id
        );
    }
  }
}
