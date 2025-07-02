// nestSpatialFree.ts

import { CheckboxInterface, displayInSidebar, IntegerInterface, NumberInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "nest.spatial.free",
  title: "free position",
  variableName: "pos",
  inputs: {
    pos: () => new NodeInputInterface("pos"),
    extent: () => new NumberInterface("extent", 0.5).use(displayInSidebar, true).setHidden(true),
    edge_wrap: () => new CheckboxInterface("edge_wrap", false).use(displayInSidebar, true).setHidden(true),
    num_dimensions: () => new IntegerInterface("num dimensions", 2, 2, 3).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const pos = this.node.getConnectedOutputInterfacesByInterface("pos");
    if (pos.length > 0) args.push(`${formatInterfaceLabels(pos).join(", ")}`);

    keyword = "extent=";
    const extent = this.node.getConnectedOutputInterfacesByInterface("extent");
    if (extent.length > 1) args.push(`${keyword}${formatInterfaceLabels(extent).join(", ")}`);
    else if (extent.length > 0) {
      const x = `${formatInterfaceLabels(extent).join(", ")}`;
      args.push(`${keyword}[-${x}, ${x}]`);
    } else if (!this.node.inputs.extent.hidden) args.push(`${keyword}${this.node.inputs.extent.value}`);

    keyword = "edge_wrap=";
    const edgeWrap = this.node.getConnectedOutputInterfaceByInterface("edge_wrap");
    if (edgeWrap != undefined) args.push(`${keyword}${formatInterfaceLabel(edgeWrap)}`);
    else if (!this.node.inputs.edge_wrap.hidden) args.push(`${keyword}${this.node.inputs.edge_wrap.value}`);

    keyword = "num_dimensions=";
    const numDimensions = this.node.getConnectedOutputInterfaceByInterface("num_dimensions");
    if (numDimensions != undefined) args.push(`${keyword}${formatInterfaceLabel(numDimensions)}`);
    else if (!this.node.inputs.num_dimensions.hidden) args.push(`${keyword}${this.node.inputs.num_dimensions.value}`);

    return args.length > 1 ? `nest.spatial.free(\n\t${args.join(",\n\t")}\n)` : `nest.spatial.free(${args.join(", ")})`;
  },
});
