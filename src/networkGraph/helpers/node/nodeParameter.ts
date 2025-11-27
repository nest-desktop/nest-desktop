// nodeParameter.ts

// import type { AbstractCodeNode } from "@babsey/code-graph";

import type { TNodeParameterParent } from "@/types";

import { BaseParameter, type IParamState } from "@/helpers/common";
import { ModelParameter } from "@/helpers/model";

import { NodeParameters } from "./nodeParameters";

export class NodeParameter extends BaseParameter {
  public _nodeParams: NodeParameters;

  constructor(nodeParams: NodeParameters) {
    super();

    this._nodeParams = nodeParams;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter | undefined {
    return this.nodeParams.node.model.params.get(this.id);
  }

  get nodeParams(): NodeParameters {
    return this._nodeParams;
  }

  get node(): TNodeParameterParent {
    return this.nodeParams.node;
  }

  override get parent(): NodeParameters {
    return this.nodeParams;
  }

  /**
   * SAve node parameter to state.
   * @return parameter state
   */
  override save(): IParamState {
    const paramState = super.save();

    // Add label if existed.
    if (this.label) paramState.label = this.label;

    return paramState;
  }
}
