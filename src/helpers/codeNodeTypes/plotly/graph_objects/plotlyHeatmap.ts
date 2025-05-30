// plotlyHeatmap.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Heatmap",
  title: "Heatmap",
  inputs: {
    z: () => new NodeInputInterface("z"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "heatmap",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const z = this.node.getConnectedOutputInterfacesByInterface("z");
    if (z.length > 0) args.push(`z=${this.code?.graph.formatInterfaceLabels(z).join(", ")}`);

    return `go.Heatmap(${args.join(", ")})`;
  },
});
