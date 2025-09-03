// nestSpatialFree.ts

import { CheckboxInterface, displayInSidebar, IntegerInterface, NumberInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestSpatialFree from "./nestSpatialFree";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

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
  onGraphUpdate() {
    if (!this.node) return;

    if (!this.node.view) {
      const codeNode = this.node.getConnectedNodeByInterface("out");

      if (!codeNode || !codeNode.view) return;

      this.node.view = codeNode.view.spatial;
      this.node.view.codeNodes.node = this.node;
    }

    this.node.view.init();
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

export const addNESTSpatialFree = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  const typeIdx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.spatial.free").length;
  const codeNode = graph.addNodeAtColumn(nestSpatialFree, -1, 900 + 240 * typeIdx, idx);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTSpatialFree = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  const codeNode = addNESTSpatialFree(graph, idx);

  return codeNode;
};
