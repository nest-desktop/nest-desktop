// plotlyFigure.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "plotly.graph_objects.Figure",
  title: "Figure",
  inputs: {
    trace: () => new NodeInputInterface("trace"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "fig",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const trace = this.node.getConnectedOutputInterfacesByInterface("trace");
    if (trace.length > 1) args.push(`data=[${this.code?.graph.formatInterfaceLabels(trace).join(", ")}]`);
    else if (trace.length === 1) args.push(`data=${this.code?.graph.formatInterfaceLabels(trace).join(", ")}`);

    return `go.Figure(${args.join(", ")})`;
  },
});
