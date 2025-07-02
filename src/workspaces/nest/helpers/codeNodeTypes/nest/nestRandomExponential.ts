// nestRandomExponential.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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

    const beta = this.node.getConnectedOutputInterfaceByInterface("beta");
    if (beta != undefined) args.push(`${formatInterfaceLabel(beta)}`);
    else if (!this.node.inputs.beta.hidden) args.push(`${this.node.inputs.beta.value}`);

    return `nest.random.exponential(${args.join(", ")})`;
  },
});
