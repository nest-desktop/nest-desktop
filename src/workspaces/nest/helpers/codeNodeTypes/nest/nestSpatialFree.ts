// nestSpatialFree.ts

import { CheckboxInterface, displayInSidebar, IntegerInterface, TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "nest.spatial.free",
  title: "free position",
  variableName: "pos",
  inputs: {
    pos: () => new NodeInputInterface("pos"),
    extent: () => new TextInputInterface("extent", "[-0.5, 0.5]").use(displayInSidebar, true).setHidden(true),
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

    const pos = this.node.getConnectedOutputInterfaceByInterface("pos");
    if (pos.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(pos).join(", ")}`);

    keyword = "extent=";
    const extent = this.node.getConnectedOutputInterfaceByInterface("extent");
    if (extent.length > 1) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(extent).join(", ")}`);
    else if (extent.length > 0) {
      const x = `${this.code?.graph.formatInterfaceLabels(extent).join(", ")}`;
      args.push(`${keyword}[-${x}, ${x}]`);
    } else if (!this.node.inputs.extent.hidden) args.push(`${keyword}${this.node.inputs.extent.value}`);

    keyword = "edge_wrap=";
    const edgeWrap = this.node.getConnectedOutputInterfaceByInterface("edge_wrap");
    if (edgeWrap.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(edgeWrap).join(", ")}`);
    else if (!this.node.inputs.edge_wrap.hidden) args.push(`${keyword}${this.node.inputs.edge_wrap.value}`);

    keyword = "num_dimensions=";
    const numDimensions = this.node.getConnectedOutputInterfaceByInterface("num_dimensions");
    if (numDimensions.length > 0)
      args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(numDimensions).join(", ")}`);
    else if (!this.node.inputs.num_dimensions.hidden) args.push(`${keyword}${this.node.inputs.num_dimensions.value}`);

    return args.length > 1 ? `nest.spatial.free(\n\t${args.join(",\n\t")}\n)` : `nest.spatial.free(${args.join(", ")})`;
  },
});
