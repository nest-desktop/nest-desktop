// nodeParameter.ts

// import type { AbstractCodeNode } from "@babsey/code-graph";

import { BaseParameter, type IParamState } from "@/parameter";

import type { NodeParameters } from "./nodeParameters";

export class NodeParameter<TParent extends NodeParameters = NodeParameters> extends BaseParameter<TParent> {
  constructor(parent: TParent) {
    super(parent);
  }

  get nodeParams(): TParent {
    return this.parent;
  }

  /**
   * Save node parameter to state.
   * @return parameter state
   */
  override save(): IParamState {
    const paramState = super.save();

    // Add label if existed.
    if (this.label) paramState.label = this.label;

    return paramState;
  }
}
