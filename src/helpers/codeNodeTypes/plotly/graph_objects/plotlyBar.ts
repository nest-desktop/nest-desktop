// plotlyBar.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Bar",
  title: "Bar",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "bar",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const x = this.node.getConnectedOutputInterfacesByInterface("x");
    if (x.length > 0) args.push(`x=${this.code?.graph.formatInterfaceLabels(x).join(", ")}`);

    const y = this.node.getConnectedOutputInterfacesByInterface("y");
    if (y.length > 0) args.push(`y=${this.code?.graph.formatInterfaceLabels(y).join(", ")}`);

    return `go.Bar(${args.join(", ")})`;
  },
});
