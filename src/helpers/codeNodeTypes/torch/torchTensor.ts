// torchTensor.ts

import { IntegerInterface, setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.tensor",
  title: "tensor",
  inputs: {
    data: () => new IntegerInterface("data", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "tensor",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const data = this.node.getConnectedOutputInterfacesByInterface("data");
    if (data.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(data, false).join(", ")}`);
    else args.push(`${this.node.inputs.data.value}`);

    return `torch.tensor(${args.join(", ")})`;
  },
});
