// listComprehension.ts

import { IntegerInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "range",
  title: "range",
  inputs: {
    start: () => new IntegerInterface("start", 0),
    stop: () => new IntegerInterface("stop", 1),
    step: () => new IntegerInterface("step", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];
    let keyword = "";

    const start = this.node.getConnectedOutputInterfaceByInterface("start");
    if (start.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(start).join(", ")}`);
    else if (this.node.inputs.start.value > 0) args.push(`${this.node.inputs.start.value}`);

    const stop = this.node.getConnectedOutputInterfaceByInterface("stop");
    if (stop.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(stop).join(", ")}`);
    else args.push(`${this.node.inputs.stop.value}`);

    keyword = args.length < 2 ? "step=" : "";
    const step = this.node.getConnectedOutputInterfaceByInterface("step");
    if (step.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(step).join(", ")}`);
    else if (this.node.inputs.step.value > 1) args.push(`${keyword}${this.node.inputs.step.value}`);

    return `range(${args.join(",")})`;
  },
});
