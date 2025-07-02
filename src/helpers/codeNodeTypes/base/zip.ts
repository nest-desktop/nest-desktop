// zip.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "zip",
  title: "zip",
  inputs: {
    iterables: () => new NodeInputInterface(),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "z",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const input = this.node.getConnectedOutputInterfaceByInterface("iterables");
    if (input) args.push(`${formatInterfaceLabel(input)}`);

    return `zip(${args.join(", ")})`;
  },
});
