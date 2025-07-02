// elephantCV.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "elephant.statistics.cv",
  title: "coefficient of variation",
  inputs: {
    a: () => new NodeInputInterface("a"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedOutputInterfaceByInterface("a");
    if (a != undefined) args.push(`${formatInterfaceLabel(a)}`);

    return `elephant.statistics.cv(${args.join(", ")})`;
  },
  variableName: "variation",
});
