// plotlyHistogram.ts

import { displayInSidebar, IntegerInterface, setType, TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

import { getPlotlyExpressArgs } from "./helpers";
import { numberType } from "../../base/interfaceTypes";

export default defineCodeNode({
  type: "plotly.express.histogram",
  title: "histogram",
  inputs: {
    data_frame: () => new NodeInputInterface("data_frame"),
    x: () => new TextInputInterface("x", ""),
    y: () => new TextInputInterface("y", ""),
    nbins: () => new IntegerInterface("nbins", 10).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    range_x: () => new TextInputInterface("range_x", "[0,10]").use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = getPlotlyExpressArgs(this.node);

    if (!this.node.inputs.nbins?.hidden) {
      const nbins = this.node.getConnectedOutputInterfaceByInterface("nbins");
      if (nbins != undefined) args.push(`nbins=${formatInterfaceLabel(nbins)}`);
      else if (this.node.inputs.nbins?.value) args.push(`nbins=${this.node.inputs.nbins?.value}`);
    }

    if (!this.node.inputs.range_x?.hidden) {
      const rangeX = this.node.getConnectedOutputInterfaceByInterface("range_x");
      if (rangeX != undefined) args.push(`range_x=${formatInterfaceLabel(rangeX)}`);
      else if (this.node.inputs.range_x?.value) args.push(`range_x=${this.node.inputs.range_x?.value}`);
    }

    return `px.histogram(${args.join(", ")})`;
  },
  variableName: "fig",
});
