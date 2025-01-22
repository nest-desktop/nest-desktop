// plotlyScatter.ts

import { CheckboxInterface, displayInSidebar, SelectInterface, TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { getPlotlyArgs } from "./helpers";

export default defineCodeNode({
  type: "plotly.express.scatter",
  title: "scatter",
  inputs: {
    data_frame: () => new NodeInputInterface("data_frame"),
    x: () => new TextInputInterface("x", ""),
    y: () => new TextInputInterface("y", ""),
    color: () => new TextInputInterface("color", "").use(displayInSidebar, true).setHidden(true),
    symbol: () => new TextInputInterface("symbol", "").use(displayInSidebar, true).setHidden(true),
    size: () => new TextInputInterface("size", "").use(displayInSidebar, true).setHidden(true),
    marginal_x: () =>
      new SelectInterface("marginal x", "", ["", "rug", "box", "violin", "histogram"])
        .use(displayInSidebar, true)
        .setHidden(true),
    marginal_y: () =>
      new SelectInterface("marginal y", "", ["", "rug", "box", "violin", "histogram"])
        .use(displayInSidebar, true)
        .setHidden(true),
    log_x: () => new CheckboxInterface("log x", false).use(displayInSidebar, true).setHidden(true),
    log_y: () => new CheckboxInterface("log y", false).use(displayInSidebar, true).setHidden(true),
    render_mode: () =>
      new SelectInterface("render_mode", "auto", ["auto", "svg", "wegbl"]).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = getPlotlyArgs(this);

    if (this.node.inputs.color.value) args.push(`color="${this.node.inputs.color.value}"`);
    if (this.node.inputs.symbol.value) args.push(`symbol="${this.node.inputs.symbol.value}"`);
    if (this.node.inputs.size.value) args.push(`size="${this.node.inputs.size.value}"`);
    if (this.node.inputs.marginal_x.value) args.push(`marginal_x="${this.node.inputs.marginal_x.value}"`);
    if (this.node.inputs.marginal_y.value) args.push(`marginal_y="${this.node.inputs.marginal_y.value}"`);
    if (this.node.inputs.log_x.value) args.push(`log_x=True`);
    if (this.node.inputs.log_y.value) args.push(`log_y=True`);
    if (this.node.inputs.render_mode.value !== "auto") args.push(`render_mode="${this.node.inputs.render_mode.value}"`);

    return args.length > 0 ? `px.scatter(\n\t${args.join(",\n\t")}\n)` : "px.scatter()";
  },
  variableName: "fig",
});
