// nodeCompartmentParameter.ts

import {
  NodeParameter,
  NodeParameterProps,
} from "@/helpers/node/nodeParameter";

import { NESTModelCompartmentParameter } from "@nest/helpers/model/nestModelCompartmentParameter";
import { NESTNodeCompartment } from "./nestNodeCompartment";

export interface NESTNodeCompartmentParameterProps extends NodeParameterProps {}

export class NESTNodeCompartmentParameter extends NodeParameter {
  constructor(
    nodeCompartment: NESTNodeCompartment,
    param: NESTNodeCompartmentParameterProps
  ) {
    super(nodeCompartment, param);
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
