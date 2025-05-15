// torchRandn.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.randn",
  title: "randn",
  inputs: {
    batch: () => new IntegerInterface("batch", 1).use(setType, numberType).use(displayInSidebar, true),
    channel: () => new IntegerInterface("channel", 1).use(setType, numberType).use(displayInSidebar, true),
    x: () => new IntegerInterface("x", 1).use(setType, numberType).use(displayInSidebar, true),
    y: () => new IntegerInterface("y", 1).use(setType, numberType).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.randn(${this.node.inputs.batch.value}, ${this.node.inputs.channel.value}, ${this.node.inputs.x.value}, ${this.node.inputs.y.value})`;
  },
});
