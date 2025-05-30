// torchZeros.ts

import { IntegerInterface, setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.zeros",
  title: "zeros",
  inputs: {
    size: () => new IntegerInterface("size", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "zeros",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const size = this.node.getConnectedOutputInterfacesByInterface("size");
    if (size.length === 0) args.push(`${this.node.inputs.size.value}`);
    else args.push(`${this.code?.graph.formatInterfaceLabels(size, false).join(", ")}`);

    return `torch.zeros(${args.join(", ")})`;
  },
});
