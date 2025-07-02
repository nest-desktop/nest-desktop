// nestRandomUniform.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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

    const min = this.node.getConnectedOutputInterfaceByInterface("min");
    if (min != undefined) args.push(`${formatInterfaceLabel(min)}`);
    else if (!this.node.inputs.min.hidden) args.push(`${this.node.inputs.min.value}`);

    keyword = args.length < 1 ? "max=" : "";
    const max = this.node.getConnectedOutputInterfaceByInterface("max");
    if (max != undefined) args.push(`${keyword}${formatInterfaceLabel(max)}`);
    else if (!this.node.inputs.max.hidden) args.push(`${keyword}${this.node.inputs.max.value}`);

    return `nest.random.uniform(${args.join(", ")})`;
  },
});
