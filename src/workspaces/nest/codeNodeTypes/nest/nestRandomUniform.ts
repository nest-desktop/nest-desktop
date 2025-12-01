// nestRandomUniform.ts

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode } from "@babsey/code-graph";

// import nestRandomUniform from "./nestRandomUniform";
// import { NESTCodeGraph } from "../../codeGraph/codeGraph";

// export interface INESTRandomUniformState {
//   min?: number
//   max?: number
// }

export const nestRandomUniform = defineCodeNode({
  type: "nest.random.uniform",
  title: "random uniform",
  variableName: "r",
  inputs: {
    min: () => new NumberInterface("min", 0).setOptional(true),
    max: () => new NumberInterface("max", 1).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  // codeTemplate() {
  //   if (!this.node) return this.type;
  //   const args: string[] = [];
  //   let keyword: string = "";

  //   const min = this.node.getConnectedNodeByInterface("min");
  //   if (min != undefined) args.push(`${min.value}`);
  //   else if (!this.node.inputs.min.hidden) args.push(`${this.node.inputs.min.value}`);

  //   keyword = args.length < 1 ? "max=" : "";
  //   const max = this.node.getConnectedNodeByInterface("max");
  //   if (max != undefined) args.push(`${keyword}${max.value}`);
  //   else if (!this.node.inputs.max.hidden) args.push(`${keyword}${this.node.inputs.max.value}`);

  //   return `nest.random.uniform(${args.join(", ")})`;
  // },
});

// export const addNESTRandomUniform = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
//   let position: { x: number; y: number };

//   if (idx !== -1) {
//     position = getPositionBeforeNode(graph.nodes[idx]);
//   } else {
//     const typeIdx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.random.uniform").length;
//     position = getPositionAtColumn(-2, 900 + 240 * typeIdx);
//   }

//   const codeNode = graph.addNodeAtCoordinates(nestRandomUniform, position);
//   codeNode.state.integrated = true;
//   return codeNode;
// };

// export const loadNESTRandomUniform = (
//   graph: CodeGraph | NESTCodeGraph,
//   randState?: INESTRandomUniformState,
//   idx: number = -1,
// ): AbstractCodeNode => {
//   const codeNode = addNESTRandomUniform(graph, idx);
//   codeNode.state.props = randState;
//   if (randState) codeNode.updateValues(randState);

//   return codeNode;
// };
