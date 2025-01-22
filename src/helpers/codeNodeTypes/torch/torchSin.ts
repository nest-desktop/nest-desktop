// torchSin.ts

import { setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.sin",
  title: "sinewave",
  inputs: {
    input: () => new NodeInputInterface<ITorchTensor>("input").use(setType, torchTensorType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "sin",
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.sin(${this.node.inputs.input.value})`;
  },
});
