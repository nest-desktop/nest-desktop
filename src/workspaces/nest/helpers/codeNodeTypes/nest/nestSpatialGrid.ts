// nestSpatialGrid.ts

import { CheckboxInterface, displayInSidebar, TextInputInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestSpatialGrid from "./nestSpatialGrid";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

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
    if (shape.length > 1) args.push(`${formatInterfaceLabels(shape).join(", ")}`);
    else if (shape.length > 0) {
      const x = `${formatInterfaceLabels(shape).join(", ")}`;
      args.push(`[${x}, ${x}]`);
    } else args.push(`${this.node.inputs.shape.value}`);

    keyword = "center=";
    const center = this.node.getConnectedOutputInterfacesByInterface("center");
    if (center.length > 1) args.push(`${keyword}${formatInterfaceLabels(center).join(", ")}`);
    else if (center.length > 0) {
      const x = `${formatInterfaceLabels(center).join(", ")}`;
      args.push(`${keyword}[${x}, ${x}]`);
    } else if (!this.node.inputs.center.hidden) args.push(`${keyword}${this.node.inputs.center.value}`);

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

    return args.length > 1 ? `nest.spatial.grid(\n\t${args.join(",\n\t")}\n)` : `nest.spatial.grid(${args.join(", ")})`;
  },
});

export const addNESTSpatialGrid = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  const typeIdx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.spatial.free").length;
  const codeNode = graph.addNodeAtColumn(nestSpatialGrid, -1, 900 + 240 * typeIdx, idx);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTSpatialGrid = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  const codeNode = addNESTSpatialGrid(graph, idx);

  return codeNode;
};
