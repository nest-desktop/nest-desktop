// nestRandomUniform.ts

import { CodeNodeOutputInterface, IntegerInterface, defineCodeNode } from "@babsey/code-graph";

// import nestRandomUniformInt from "./nestRandomUniformInt";
// import { NESTCodeGraph } from "../../codeGraph/codeGraph";

// export interface INESTRandomUniformIntState {
//   max?: number;
// }

export const nestRandomUniformInt = defineCodeNode({
  type: "nest.random.uniform_int",
  title: "random uniform int",
  variableName: "r",
  inputs: {
    max: () => new IntegerInterface("max", 1).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  // codeTemplate() {
  //   if (!this.node) return this.type;
  //   const args: string[] = [];

  //   const max = this.node.getConnectedNodeByInterface("max");
  //   if (max != undefined) args.push(`${max.value}`);
  //   else args.push(`${this.node.inputs.max.value}`);

  //   return `nest.random.uniform_int(${args.join(", ")})`;
  // },
});

// export const addNESTRandomUniformInt = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   const codeNode = graph.addNodeAtCoordinates(nestRandomUniformInt, getPositionAtColumn(-2, 900));
//   codeNode.state.integrated = true;
//   return codeNode;
// };

// export const loadNESTRandomUniformInt = (
//   graph: CodeGraph | NESTCodeGraph,
//   randState?: INESTRandomUniformIntState,
// ): AbstractCodeNode => {
//   const codeNode = addNESTRandomUniformInt(graph);
//   codeNode.state.props = randState;
//   if (randState) codeNode.updateValues(randState);

//   return codeNode;
// };
