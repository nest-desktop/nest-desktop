// torchOptimAdam.ts

import { displayInSidebar, NodeInterface, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.optim.Adam",
  title: "Adam",
  inputs: {
    params: () => new NodeInterface("params", 1),
    lr: () => new NumberInterface("lr", 0.001).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    step: () => new NodeOutputInterface("step", "step()"),
    zero_grad: () => new NodeOutputInterface("zero grad", "zero_grad()"),
  },
  variableName: "optimizer",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const params = this.node.getConnectedOutputInterfacesByInterface("params");
    if (params.length === 0) args.push(`${this.node.inputs.params.value}`);
    else args.push(`${this.code?.graph.formatInterfaceLabels(params, false).join(", ")}`);

    return `optim.Adam(${args.join(", ")})`;
  },
});
