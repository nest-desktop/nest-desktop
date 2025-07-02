// list.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "list",
  title: "list",
  inputs: {
    iterable: () => new NodeInputInterface("iterable"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "n",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const iterable = this.node.getConnectedOutputInterfacesByInterface("iterable");
    if (iterable.length > 1) args.push(`(${formatInterfaceLabels(iterable, false).join(", ")})`);
    else if (iterable.length > 0) args.push(`${formatInterfaceLabels(iterable, false).join(", ")}`);

    return `list(${args.join(", ")})`;
  },
});
