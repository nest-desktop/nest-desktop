// plotlyMakeSubplots.ts

import { IntegerInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly.subplots.make_subplots",
  title: "make subplots",
  inputs: {
    rows: () => new IntegerInterface("rows", 1),
    cols: () => new IntegerInterface("cols", 1),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "fig",
  codeTemplate() {
    if (!this.node) return "";
    const args = [];

    const rows = this.node.getConnectedOutputInterfaceByInterface("rows");
    if (rows) args.push(`rows=${this.code?.graph.formatInterfaceLabel(rows)}`);
    else args.push(`rows=${this.node.inputs.rows.value}`);

    const cols = this.node.getConnectedOutputInterfaceByInterface("cols");
    if (cols) args.push(`cols=${this.code?.graph.formatInterfaceLabel(cols)}`);
    else args.push(`cols=${this.node.inputs.cols.value}`);

    return `subplots.make_subplots(${args.join(", ")})`;
  },
});
