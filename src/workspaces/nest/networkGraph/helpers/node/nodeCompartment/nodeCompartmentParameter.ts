// nodeCompartmentParameter.ts

import { BaseParameter } from "@/helpers/common";

import { NESTModelCompartmentParameter } from "../../../../helpers/model/modelCompartmentParameter";
import { NESTNodeCompartment } from "./nodeCompartment";
import { NESTNodeCompartmentParameters } from "./nodeCompartmentParameters";

export class NESTNodeCompartmentParameter extends BaseParameter {
  private _nodeCompartmentParams: NESTNodeCompartmentParameters;

  constructor(nodeCompartmentParams: NESTNodeCompartmentParameters) {
    super();

    this._nodeCompartmentParams = nodeCompartmentParams;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): NESTModelCompartmentParameter | undefined {
    return this.nodeCompartmentParams?.nodeCompartment?.model?.compartmentParams?.get(this.id);
  }

  get nodeCompartmentParams(): NESTNodeCompartmentParameters {
    return this._nodeCompartmentParams as NESTNodeCompartment;
  }

  get visible(): boolean {
    return this.nodeCompartmentParams.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.nodeCompartmentParams.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.nodeCompartmentParams.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.nodeCompartmentParams.paramsVisible = this.nodeCompartmentParams.paramsVisible.filter(
        (paramId: string) => paramId !== this.id,
      );
    }
  }
}
