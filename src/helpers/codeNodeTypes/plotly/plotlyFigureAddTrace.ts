// plotlyFigureAddTrace.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { IntegerInterface } from "baklavajs";

export default defineCodeNode({
  type: "plotly.fig.add_trace",
  title: "add trace",
  inputs: {
    fig: () => new NodeInputInterface("fig"),
    trace: () => new NodeInputInterface("trace"),
    row: () => new IntegerInterface("row", 1),
    col: () => new IntegerInterface("col", 1),
  },
  codeTemplate() {
    if (!this.node) return this.type;

    const fig = this.node.getConnectedOutputInterfacesByInterface("fig");
    const figname = this.code?.graph.formatInterfaceLabels(fig).join(", ");

    const args = [];

    const trace = this.node.getConnectedOutputInterfaceByInterface("trace");
    if (trace) args.push(`trace=${this.code?.graph.formatInterfaceLabel(trace)}`);

    return `${figname}.add_trace(${args.join(", ")})`;
  },
});
