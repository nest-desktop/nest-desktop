// torchCat.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";

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

    const tensors = this.node.getConnectedOutputInterfaceByInterface("tensors");
    if (tensors) args.push(`${formatInterfaceLabel(tensors)}`);

    return `torch.cat(${args.join(", ")})`;
  },
});
