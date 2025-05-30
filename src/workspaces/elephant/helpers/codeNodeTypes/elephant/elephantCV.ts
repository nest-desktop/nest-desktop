// elephantCV.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

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

    const a = this.node.getConnectedOutputInterfacesByInterface("a");
    if (a.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(a).join(", ")}`);

    return `elephant.statistics.cv(${args.join(", ")})`;
  },
  variableName: "variation",
});
