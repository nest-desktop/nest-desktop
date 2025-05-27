// nestRandomUniform.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.uniform",
  title: "random uniform",
  variableName: "randuni",
  inputs: {
    min: () => new NumberInterface("min", 0).use(displayInSidebar, true).setHidden(true),
    max: () => new NumberInterface("max", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const min = this.node.getConnectedOutputInterfacesByInterface("min");
    if (min.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(min).join(", ")}`);
    else if (!this.node.inputs.min.hidden) args.push(`${this.node.inputs.min.value}`);

    keyword = args.length < 1 ? "max=" : "";
    const max = this.node.getConnectedOutputInterfacesByInterface("max");
    if (max.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(max).join(", ")}`);
    else if (!this.node.inputs.max.hidden) args.push(`${keyword}${this.node.inputs.max.value}`);

    return `nest.random.uniform(${args.join(", ")})`;
  },
});
