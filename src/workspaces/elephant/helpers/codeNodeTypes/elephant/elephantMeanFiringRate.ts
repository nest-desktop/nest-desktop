// elephantMeanFiringRate.ts

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "elephant.statistics.mean_firing_rate",
  modules: ["quantities"],
  title: "mean firing rate",
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

    return `elephant.statistics.mean_firing_rate(${args.join(", ")})`;
  },
  variableName: "rate",
});
