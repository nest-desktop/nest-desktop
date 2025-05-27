// nestRandomNormal.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.normal",
  title: "random normal",
  variableName: "randnorm",
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

    const mean = this.node.getConnectedOutputInterfacesByInterface("mean");
    if (mean.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(mean).join(", ")}`);
    else if (!this.node.inputs.mean.hidden) args.push(`${this.node.inputs.mean.value}`);

    keyword = args.length < 1 ? "std=" : "";
    const std = this.node.getConnectedOutputInterfacesByInterface("std");
    if (std.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(std).join(", ")}`);
    else if (!this.node.inputs.std.hidden) args.push(`${keyword}${this.node.inputs.std.value}`);

    return `nest.random.normal(${args.join(", ")})`;
  },
});
