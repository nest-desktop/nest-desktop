// plotlyScattergl.ts

import { SelectInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { getPlotlyGraphObjectsArgs } from "../express/helpers";

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
    const args = getPlotlyGraphObjectsArgs(this.node);

    if (this.node.inputs.mode.value) args.push(`mode="${this.node.inputs.mode.value}"`);

    return `go.Scattergl(${args.join(", ")})`;
  },
});
