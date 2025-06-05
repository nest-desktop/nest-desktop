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
    const args = [];

    const fig = this.node.getConnectedOutputInterfacesByInterface("fig");
    const figname = this.code?.graph.formatInterfaceLabels(fig).join(", ");

    const trace = this.node.getConnectedOutputInterfaceByInterface("trace");
    if (trace) args.push(`${this.code?.graph.formatInterfaceLabel(trace)}`);

    const row = this.node.getConnectedOutputInterfaceByInterface("row");
    if (row) args.push(`row=${this.code?.graph.formatInterfaceLabel(row)}`);
    else args.push(`row=${this.node.inputs.row.value}`);

    const col = this.node.getConnectedOutputInterfaceByInterface("col");
    if (col) args.push(`col=${this.code?.graph.formatInterfaceLabel(col)}`);
    else args.push(`col=${this.node.inputs.col.value}`);

    return `${figname}.add_trace(${args.join(", ")})`;
  },
});
