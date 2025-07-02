// plotlyFigureAddTrace.ts

import { IntegerInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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

    const fig = this.node.getConnectedOutputInterfaceByInterface("fig");
    if (fig != undefined) return this.type;
    const figname = formatInterfaceLabel(fig);

    const trace = this.node.getConnectedOutputInterfaceByInterface("trace");
    if (trace != undefined) args.push(`${formatInterfaceLabel(trace)}`);

    const row = this.node.getConnectedOutputInterfaceByInterface("row");
    if (row != undefined) args.push(`row=${formatInterfaceLabel(row)}`);
    else args.push(`row=${this.node.inputs.row.value}`);

    const col = this.node.getConnectedOutputInterfaceByInterface("col");
    if (col != undefined) args.push(`col=${formatInterfaceLabel(col)}`);
    else args.push(`col=${this.node.inputs.col.value}`);

    return `${figname}.add_trace(${args.join(", ")})`;
  },
});
