// nestSpatialGrid.ts

import {
  CheckboxInterface,
  CodeNodeOutputInterface,
  ListInputInterface,
  defineCodeNode,
  getPositionAtColumn,
  getPositionBeforeNode,
  type AbstractCodeNode,
  type CodeGraph,
} from "@babsey/code-graph";

import { INESTNodeSpatialState } from "../../network/node/nodeSpatial";

export const nestSpatialGrid = defineCodeNode({
  type: "nest.spatial.grid",
  title: "grid position",
  variableName: "pos",
  inputs: {
    shape: () => new ListInputInterface("shape", "1, 1"),
    center: () => new ListInputInterface("center", "0, 0").setOptional(true),
    extent: () => new ListInputInterface("extent", "-0.5, 0.5").setOptional(true),
    edge_wrap: () => new CheckboxInterface("edge_wrap", false).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  onConnected() {
    if (!this.code.project) return;
    updateNodeMask(this);
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
  // codeTemplate() {
  //   if (!this.node) return this.type;
  //   const args: string[] = [];
  //   let keyword: string = "";

  //   const shape = this.node.getConnectedNodesByInterface("shape");
  //   if (shape.length > 1) args.push(`${formatLabels(shape).join(", ")}`);
  //   else if (shape.length > 0) {
  //     const x = `${formatLabels(shape).join(", ")}`;
  //     args.push(`[${x}, ${x}]`);
  //   } else args.push(`${this.node.inputs.shape.value}`);

  //   keyword = "center=";
  //   const center = this.node.getConnectedNodesByInterface("center");
  //   if (center.length > 1) args.push(`${keyword}${formatLabels(center).join(", ")}`);
  //   else if (center.length > 0) {
  //     const x = `${formatLabels(center).join(", ")}`;
  //     args.push(`${keyword}[${x}, ${x}]`);
  //   } else if (!this.node.inputs.center.hidden) args.push(`${keyword}${this.node.inputs.center.value}`);

  //   keyword = "extent=";
  //   const extent = this.node.getConnectedNodesByInterface("extent");
  //   if (extent.length > 1) args.push(`${keyword}${formatLabels(extent).join(", ")}`);
  //   else if (extent.length > 0) {
  //     const x = `${formatLabels(extent).join(", ")}`;
  //     args.push(`${keyword}[-${x}, ${x}]`);
  //   } else if (!this.node.inputs.extent.hidden) args.push(`${keyword}${this.node.inputs.extent.value}`);

  //   keyword = "edge_wrap=";
  //   const edgeWrap = this.node.getConnectedNodeByInterface("edge_wrap");
  //   if (edgeWrap != undefined) args.push(`${keyword}${edgeWrap.value}`);
  //   else if (!this.node.inputs.edge_wrap.hidden) args.push(`${keyword}${this.node.inputs.edge_wrap.value}`);

  //   return args.length > 1 ? `nest.spatial.grid(\n\t${args.join(",\n\t")}\n)` : `nest.spatial.grid(${args.join(", ")})`;
  // },
});

export const addNESTSpatialGrid = (graph: CodeGraph, idx: number = -1): AbstractCodeNode => {
  let position: { x: number; y: number };

  if (idx !== -1) {
    position = getPositionBeforeNode(graph.nodes[idx]);
  } else {
    const typeIdx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.spatial.grid").length;
    position = getPositionAtColumn(-1, 900 + 240 * typeIdx);
  }

  const codeNode = graph.addNodeAtCoordinates(new nestSpatialGrid(), position);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTSpatialGrid = (
  graph: CodeGraph,
  spatialState: INESTNodeSpatialState = {},
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = addNESTSpatialGrid(graph, idx);
  if (spatialState) codeNode.updateInputValues(spatialState);
  return codeNode;
};

const updateNodeMask = (spatialNode: AbstractCodeNode) => {
  const codeNode = spatialNode.getConnectedNodeByInterface("out", "outputs");
  if (!codeNode || !codeNode.mask) return;

  codeNode.mask.load({ positions: "grid" });
};

// export const updateNESTSpatialGrid = (codeNode: AbstractCodeNode, state: INESTNodeSpatialState) => {
//   if (state.pos) codeNode.inputs.pos.value = state.pos;
//   if (state.extent) codeNode.inputs.extent.value = state.extent;
//   if (state.edge_wrap) codeNode.inputs.edge_wrap.value = state.edge_wrap;
//   if (state.num_dimensions) codeNode.inputs.num_dimensions.value = state.num_dimensions;
// };
