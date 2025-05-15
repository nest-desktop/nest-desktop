// plotlyScattergl.ts

import { SelectInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.graph_objects.Scattergl",
  title: "Scatter (gl)",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
    mode: () => new SelectInterface("mode", "markers", ["lines", "lines+markers", "markers"]),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "scattergl",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const x = this.node.getConnectedOutputInterfaceByInterface("x");
    if (x.length > 0) args.push(`x=${this.code?.graph.formatInterfaceLabels(x).join(", ")}`);

    const y = this.node.getConnectedOutputInterfaceByInterface("y");
    if (y.length > 0) args.push(`y=${this.code?.graph.formatInterfaceLabels(y).join(", ")}`);

    if (this.node.inputs.mode.value) args.push(`mode="${this.node.inputs.mode.value}"`);

    return `go.Scattergl(${args.join(", ")})`;
  },
});
