// nodeParameter.ts

import { NodeParameter } from "@/network";

import { getNESTModelParameterStates } from "../../model";
import { type IParamState, updateNESTParameterNode } from "../../codeNodeTypes/nest";

export class NESTNodeParameter extends NodeParameter {
  override get hidden(): boolean {
    return this.intf?.hidden ?? this.state.hidden;
  }

  override set hidden(value: boolean) {
    this.state.hidden = value;
    const node = this.nodeParams.node;
    if (!this.codeNode && this.nodeParams.hasSomeVisibleParams) {
      const defaultParamStates = getNESTModelParameterStates(node.modelId);
      updateNESTParameterNode(node.codeNode, "params", defaultParamStates as Record<string, IParamState>);
    }
    this.intf?.setHidden(value);
    if (this.codeNode && !this.nodeParams.hasSomeVisibleParams) {
      updateNESTParameterNode(node.codeNode, "params");
      this.nodeParams.unregisterCodeNode();
    }
  }
}
