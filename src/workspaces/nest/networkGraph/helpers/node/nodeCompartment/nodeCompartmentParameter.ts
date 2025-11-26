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

  override get parent(): NESTNodeCompartmentParameters {
    return this.nodeCompartmentParams;
  }
}
