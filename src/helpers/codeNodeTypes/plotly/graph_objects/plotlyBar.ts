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

    const x = this.node.getConnectedOutputInterfaceByInterface("x");
    if (x) args.push(`x=${this.code?.graph.formatInterfaceLabel(x)}`);

    const y = this.node.getConnectedOutputInterfaceByInterface("y");
    if (y) args.push(`y=${this.code?.graph.formatInterfaceLabel(y)}`);

    return `go.Bar(${args.join(", ")})`;
  },
});
