// nestSpatialFree.ts

import {
  CheckboxInterface,
  CodeNodeInputInterface,
  CodeNodeOutputInterface,
  IntegerInterface,
  ListInputInterface,
  defineCodeNode,
} from "@babsey/code-graph";

export const nestSpatialFree = defineCodeNode({
  type: "nest.spatial.free",
  title: "free position",
  variableName: "pos",
  inputs: {
    pos: () => new CodeNodeInputInterface("pos"),
    extent: () => new ListInputInterface("extent", "-0.5, 0.5").setOptional(true),
    edge_wrap: () => new CheckboxInterface("edge_wrap", false).setOptional(true),
    num_dimensions: () => new IntegerInterface("num dimensions", 2, 2, 3).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  // onGraphUpdate() {
  //   if (!this.node) return;

  //   if (!this.node.view) {
  //     const codeNode = this.node.getConnectedNodeByInterface("out");

  //     if (!codeNode || !codeNode.view) return;

  //     this.node.view = codeNode.view.spatial;
  //     this.node.view.codeNodes.node = this.node;
  //   }

  //   this.node.view.init();
  // },
  //   codeTemplate() {
  //     if (!this.node) return this.type;
  //     const args: string[] = [];
  //     let keyword: string = "";

  //     const pos = this.node.getConnectedNodesByInterface("pos");
  //     if (pos.length > 0) args.push(`${formatLabels(pos).join(", ")}`);

  //     keyword = "extent=";
  //     const extent = this.node.getConnectedNodesByInterface("extent");
  //     if (extent.length > 1) args.push(`${keyword}${formatLabels(extent).join(", ")}`);
  //     else if (extent.length > 0) {
  //       const x = `${formatLabels(extent).join(", ")}`;
  //       args.push(`${keyword}[-${x}, ${x}]`);
  //     } else if (!this.node.inputs.extent.hidden) args.push(`${keyword}${this.node.inputs.extent.value}`);

  //     keyword = "edge_wrap=";
  //     const edgeWrap = this.node.getConnectedNodeByInterface("edge_wrap");
  //     if (edgeWrap != undefined) args.push(`${keyword}${edgeWrap.value}`);
  //     else if (!this.node.inputs.edge_wrap.hidden) args.push(`${keyword}${this.node.inputs.edge_wrap.value}`);

  //     keyword = "num_dimensions=";
  //     const numDimensions = this.node.getConnectedNodeByInterface("num_dimensions");
  //     if (numDimensions != undefined) args.push(`${keyword}${numDimensions.value}`);
  //     else if (!this.node.inputs.num_dimensions.hidden) args.push(`${keyword}${this.node.inputs.num_dimensions.value}`);

  //     return args.length > 1 ? `nest.spatial.free(\n\t${args.join(",\n\t")}\n)` : `nest.spatial.free(${args.join(", ")})`;
  //   },
});

// export const addNESTSpatialFree = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
//   let position: { x: number; y: number };

//   if (idx !== -1) {
//     position = getPositionBeforeNode(graph.nodes[idx]);
//   } else {
//     const typeIdx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.spatial.free").length;
//     position = getPositionAtColumn(-1, 900 + 240 * typeIdx);
//   }

//   const codeNode = graph.addNodeAtCoordinates(nestSpatialFree, position);
//   codeNode.state.integrated = true;
//   return codeNode;
// };

// export const loadNESTSpatialFree = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
//   const codeNode = addNESTSpatialFree(graph, idx);

//   return codeNode;
// };
