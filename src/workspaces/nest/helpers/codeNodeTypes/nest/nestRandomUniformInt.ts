// nestRandomUniform.ts

import { displayInSidebar, IntegerInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.uniform_int",
  title: "random uniform int",
  variableName: "randuniint",
  inputs: {
    max: () => new IntegerInterface("max", 1).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const max = this.node.getConnectedOutputInterfacesByInterface("max");
    if (max.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(max).join(", ")}`);
    else args.push(`${this.node.inputs.max.value}`);

    return `nest.random.uniform_int(${args.join(", ")})`;
  },
});
