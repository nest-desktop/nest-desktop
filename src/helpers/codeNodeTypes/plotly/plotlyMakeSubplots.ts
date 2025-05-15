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
  codeTemplate: () => "plotly.subplots.make_subplots(rows={{ inputs.rows.value }}, cols={{ inputs.cols.value }})",
});
