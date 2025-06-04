// plotlyHistogram.ts

import { displayInSidebar, IntegerInterface, setType, TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { getPlotlyArgs } from "./helpers";
import { numberType } from "../../base/interfaceTypes";

export default defineCodeNode({
  type: "plotly.express.histogram",
  title: "histogram",
  inputs: {
    data_frame: () => new NodeInputInterface("data_frame"),
    x: () => new TextInputInterface("x", ""),
    y: () => new TextInputInterface("y", ""),
    nbins: () => new IntegerInterface("nbins", 10).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    range_x: () =>
      new TextInputInterface("range_x", "[0,10]").use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = getPlotlyArgs(this);

    return `px.histogram(${args.join(", ")})`;
  },
  variableName: "fig",
});
