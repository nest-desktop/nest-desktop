// torchCat.ts

import { setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.cat",
  title: "cat",
  inputs: {
    tensors: () => new NodeInputInterface<ITorchTensor>("tensors").use(setType, torchTensorType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const tensors = this.node.getConnectedOutputInterfacesByInterface("tensors");
    if (tensors.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(tensors).join(", ")}`);

    return `torch.cat(${args.join(", ")})`;
  },
});
