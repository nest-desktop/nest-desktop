// torchModule.ts

import { TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch.nn.Module",
  title: "Module",
  inputs: {
    className: () => new TextInputInterface("name", "NetworkModel"),
    model: () => new TextInputInterface("model", "model(inputs, state)"),
  },
  codeTemplate() {
    if (!this.node) return this.type;

    const lines = [
      `class ${this.node.inputs.className.value}(nn.Module):`,
      "\tdef __init__(self, model):",
      `\t\tsuper(${this.node.inputs.className.value}, self).__init__()`,
      `\t\tself.model = model`,
      "",
      "\tdef forward(self, inputs, state=None):",
      `\t\treturn ${this.node.inputs.model.value}`,
      "",
    ];

    return lines.join("\n");
  },
});
