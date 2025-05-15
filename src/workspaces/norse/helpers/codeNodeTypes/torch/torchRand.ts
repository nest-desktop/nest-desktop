// torchRand.ts

import { IntegerInterface, setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.rand",
  title: "rand",
  inputs: {
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const size = this.node.getConnectedOutputInterfaceByInterface("size");
    if (size.length === 0) args.push(`${this.node.inputs.size.value}`);
    else args.push(`${this.code?.graph.formatInterfaceLabels(size, false).join(", ")}`);

    return `torch.rand(${args.join(", ")})`;
  },
});
