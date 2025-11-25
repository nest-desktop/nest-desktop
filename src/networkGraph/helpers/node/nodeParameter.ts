// nodeParameter.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

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

  get codeNode(): AbstractCodeNode | undefined {
    return this.nodeParams.codeNode;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter | undefined {
    return this.nodeParams.node.model.params[this.id];
  }

  get nodeParams(): NodeParameters {
    return this._nodeParams;
  }

  get node(): TNodeParameterParent {
    return this.nodeParams.node;
  }

  /**
   * SAve node parameter to state.
   * @return parameter state
   */
  override save(): IParamState {
    const paramState: IParamState = {
      id: this.id,
      value: this.value,
    };

    // Add label if existed.
    if (this.label) paramState.label = this.label;

    // Add value factors if existed.
    if (this.factors.length > 0) paramState.factors = this.factors;

    // Add rules for validation if existed.
    if (this.rules.length > 0) paramState.rules = this.rules;

    // Add param type if not constant.
    if (!this.isConstant) paramState.type = this.saveType();

    return paramState;
  }
}
