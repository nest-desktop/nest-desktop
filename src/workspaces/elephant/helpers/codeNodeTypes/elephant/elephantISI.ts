// elephantISI.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "elephant.statistics.isi",
  title: "inter-spike interval",
  inputs: {
    spiketrain: () => new NodeInputInterface("spiketrain"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const spiketrain = this.node.getConnectedOutputInterfaceByInterface("spiketrain");
    if (spiketrain != undefined) args.push(`${formatInterfaceLabel(spiketrain)}`);

    return `elephant.statistics.isi(${args.join(", ")})`;
  },
  variableName: "intervals",
});
