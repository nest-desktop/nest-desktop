// apply.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "norse/modelApply",
  title: "apply model",
  inputs: {
    model: () => new NodeInputInterface("model"),
    inputs: () => new NodeInputInterface("inputs"),
    state: () => new NodeInputInterface("state"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    output: () => new NodeOutputInterface("output", "[0]"),
    state: () => new NodeOutputInterface("state", "[1]"),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const models = this.node.getConnectedOutputInterfacesByInterface("model");
    if (models.length == 0) return this.type;

    const args: string[] = [];

    const inputs = this.node.getConnectedOutputInterfaceByInterface("inputs");
    if (inputs != undefined) args.push(`${formatInterfaceLabel(inputs)}`);

    const state = this.node.getConnectedOutputInterfaceByInterface("state");
    if (state != undefined) args.push(`${formatInterfaceLabel(state)}`);

    return `${models[0].label}(${args.join(", ")})`;
  },
  variableName: "out",
});
