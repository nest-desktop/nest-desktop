// nestSpatialGrid.ts

import { CheckboxInterface, displayInSidebar, TextInputInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.spatial.grid",
  title: "grid position",
  variableName: "pos",
  inputs: {
    shape: () => new TextInputInterface("shape", "[1, 1]"),
    center: () => new TextInputInterface("center", "[0, 0]").use(displayInSidebar, true).setHidden(true),
    extent: () => new TextInputInterface("extent", "[-0.5, 0.5]").use(displayInSidebar, true).setHidden(true),
    edge_wrap: () => new CheckboxInterface("edge_wrap", false).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const shape = this.node.getConnectedOutputInterfacesByInterface("shape");
    if (shape.length > 1) args.push(`${this.code?.graph.formatInterfaceLabels(shape).join(", ")}`);
    else if (shape.length > 0) {
      const x = `${this.code?.graph.formatInterfaceLabels(shape).join(", ")}`;
      args.push(`[${x}, ${x}]`);
    } else args.push(`${this.node.inputs.shape.value}`);

    keyword = "center=";
    const center = this.node.getConnectedOutputInterfacesByInterface("center");
    if (center.length > 1) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(center).join(", ")}`);
    else if (center.length > 0) {
      const x = `${this.code?.graph.formatInterfaceLabels(center).join(", ")}`;
      args.push(`${keyword}[${x}, ${x}]`);
    } else if (!this.node.inputs.center.hidden) args.push(`${keyword}${this.node.inputs.center.value}`);

    keyword = "extent=";
    const extent = this.node.getConnectedOutputInterfacesByInterface("extent");
    if (extent.length > 1) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(extent).join(", ")}`);
    else if (extent.length > 0) {
      const x = `${this.code?.graph.formatInterfaceLabels(extent).join(", ")}`;
      args.push(`${keyword}[-${x}, ${x}]`);
    } else if (!this.node.inputs.extent.hidden) args.push(`${keyword}${this.node.inputs.extent.value}`);

    keyword = "edge_wrap=";
    const edgeWrap = this.node.getConnectedOutputInterfacesByInterface("edge_wrap");
    if (edgeWrap.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(edgeWrap).join(", ")}`);
    else if (!this.node.inputs.edge_wrap.hidden) args.push(`${keyword}${this.node.inputs.edge_wrap.value}`);

    return args.length > 1 ? `nest.spatial.grid(\n\t${args.join(",\n\t")}\n)` : `nest.spatial.grid(${args.join(", ")})`;
  },
});
