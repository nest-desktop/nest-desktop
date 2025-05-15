// plotlyArea.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { getPlotlyArgs } from "./helpers";

export default defineCodeNode({
  type: "plotly.express.area",
  title: "area",
  inputs: {
    data_frame: () => new NodeInputInterface("data_frame"),
    x: () => new TextInputInterface("x", ""),
    y: () => new TextInputInterface("y", ""),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = getPlotlyArgs(this);

    return `px.area(${args.join(", ")})`;
  },
  variableName: "fig",
});
