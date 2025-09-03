// nestPrepare.ts

import { CodeGraph, findNodeByType } from "@/helpers/codeGraph/codeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";

import nestPrepare from "./nestPrepare";

export default defineCodeNode({
  type: "nest.Prepare",
  title: "prepare",
  codeTemplate: () => "nest.Prepare()",
});

export const addNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return graph.addNodeAtColumn(nestPrepare, 4, 100);
};

export const getNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = findNodeByType(graph, "nest.Prepare");
  if (!codeNode) return addNESTPrepareNode(graph);
  return codeNode;
};

export const loadNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return getNESTPrepareNode(graph);
};
