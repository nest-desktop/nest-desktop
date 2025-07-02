// nestRandomLognormal.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "nest.random.lognormal",
  title: "random log normal",
  variableName: "randlognorm",
  inputs: {
    mean: () => new NumberInterface("mean", 0).use(displayInSidebar, true).setHidden(true),
    std: () => new NumberInterface("std", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const mean = this.node.getConnectedOutputInterfaceByInterface("mean");
    if (mean != undefined) args.push(`${formatInterfaceLabel(mean)}`);
    else if (!this.node.inputs.mean.hidden) args.push(`${this.node.inputs.mean.value}`);

    keyword = args.length < 1 ? "std=" : "";
    const std = this.node.getConnectedOutputInterfaceByInterface("std");
    if (std != undefined) args.push(`${keyword}${formatInterfaceLabel(std)}`);
    else if (!this.node.inputs.std.hidden) args.push(`${keyword}${this.node.inputs.std.value}`);

    return `nest.random.lognormal(${args.join(", ")})`;
  },
});
