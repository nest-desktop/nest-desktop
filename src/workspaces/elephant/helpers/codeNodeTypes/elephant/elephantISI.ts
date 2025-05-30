// elephantISI.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

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

    const spiketrain = this.node.getConnectedOutputInterfacesByInterface("spiketrain");
    if (spiketrain.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(spiketrain).join(", ")}`);

    return `elephant.statistics.isi(${args.join(", ")})`;
  },
  variableName: "intervals",
});
