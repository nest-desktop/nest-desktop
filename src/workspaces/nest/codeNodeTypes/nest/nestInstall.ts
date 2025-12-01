// nestInstall.ts

import { TextInputInterface, defineCodeNode } from "@babsey/code-graph";

export const nestInstall = defineCodeNode({
  type: "nest.Install",
  title: "install",
  inputs: {
    module_name: () => new TextInputInterface("module name", "nestmlmodule"),
  },
});

// export const addNESTInstallNode = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
//   if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Install").length;
//   const codeNode = graph.addNodeAtCoordinates(nestInstall, getPositionAtColumn(-2, 500 + 290 * idx));
//   if (idx === 0) codeNode.state.comments = "Install modules";
//   return codeNode;
// };

// export const loadNESTInstallNodes = (graph: CodeGraph | NESTCodeGraph, moduleStates: string[]): AbstractCodeNode[] => {
//   const codeNodes = graph.nodes.filter((codeNode: AbstractCodeNode) => codeNode.type === "nest.Install");

//   if (moduleStates.length === 0) {
//     codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.remove());
//     return [];
//   }

//   moduleStates.forEach((moduleState: string, idx: number) => {
//     const codeNode = codeNodes[idx] ?? addNESTInstallNode(graph);
//     codeNode.inputs.module_name.value = moduleState;
//   });

//   return codeNodes;
// };
