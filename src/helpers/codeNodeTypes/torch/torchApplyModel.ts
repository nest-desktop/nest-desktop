// torchApplyModel.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch/applyModel",
  title: "apply model",
  inputs: {
    className: () => new TextInputInterface("name", "NetworkModel"),
    model: () => new NodeInputInterface("model"),
    to: () => new NodeInputInterface("to"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    parameters: () => new NodeOutputInterface("parameters", ".parameters()"),
  },
  variableName: "model",
  codeTemplate() {
    if (!this.node) return this.type;
    let code = "";

    const modelInt = this.node.getConnectedOutputInterfaceByInterface("model");
    let model: string = "";
    if (modelInt) model = `${this.code?.graph.formatInterfaceLabel(modelInt)}`;

    code = `${this.node.inputs.className.value}(${model})`;

    const toInt = this.node.getConnectedOutputInterfaceByInterface("to");
    if (toInt) code += `.to(${this.code?.graph.formatInterfaceLabel(toInt)})`;

    return code;
  },
});
