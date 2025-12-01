// nestRandomNormal.ts

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode } from "@babsey/code-graph";

// export interface INESTRandomNormalState {
//   mean?: number
//   std?: number
// }

export const nestRandomNormal = defineCodeNode({
  type: "nest.random.normal",
  title: "random normal",
  variableName: "r",
  inputs: {
    mean: () => new NumberInterface("mean", 0).setOptional(true),
    std: () => new NumberInterface("std", 1).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
});

// export const addNESTRandomNormal = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   const codeNode = graph.addNodeAtCoordinates(nestRandomNormal, getPositionAtColumn(-2, 900));
//   codeNode.state.integrated = true;
//   return codeNode;
// };

// export const loadNESTRandomNormal = (
//   graph: CodeGraph | NESTCodeGraph,
//   randState?: INESTRandomNormalState,
// ): AbstractCodeNode => {
//   const codeNode = addNESTRandomNormal(graph);
//   codeNode.state.props = randState;
//   if (randState) codeNode.updateValues(randState);

//   return codeNode;
// };
