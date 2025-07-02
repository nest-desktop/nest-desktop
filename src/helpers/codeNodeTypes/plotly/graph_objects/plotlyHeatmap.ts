// plotlyHeatmap.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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

    const z = this.node.getConnectedOutputInterfaceByInterface("z");
    if (z != undefined) args.push(`z=${formatInterfaceLabel(z)}`);

    return `go.Heatmap(${args.join(", ")})`;
  },
});
