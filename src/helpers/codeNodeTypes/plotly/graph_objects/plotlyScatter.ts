// plotlyScatter.ts

import { SelectInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Scatter",
  title: "Scatter",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
    mode: () => new SelectInterface("mode", "markers", ["lines", "lines+markers", "markers"]),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "scatter",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const x = this.node.getConnectedOutputInterfaceByInterface("x");
    if (x) args.push(`x=${this.code?.graph.formatInterfaceLabel(x)}`);

    const y = this.node.getConnectedOutputInterfaceByInterface("y");
    if (y) args.push(`y=${this.code?.graph.formatInterfaceLabel(y)}`);

    if (this.node.inputs.mode.value) args.push(`mode="${this.node.inputs.mode.value}"`);

    return `go.Scatter(${args.join(", ")})`;
  },
});
