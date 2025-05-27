// nestRandomExponential.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.random.exponential",
  title: "random exponential",
  variableName: "randexp",
  inputs: {
    beta: () => new NumberInterface("beta", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const beta = this.node.getConnectedOutputInterfacesByInterface("beta");
    if (beta.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(beta).join(", ")}`);
    else if (!this.node.inputs.beta.hidden) args.push(`${this.node.inputs.beta.value}`);

    return `nest.random.exponential(${args.join(", ")})`;
  },
});
