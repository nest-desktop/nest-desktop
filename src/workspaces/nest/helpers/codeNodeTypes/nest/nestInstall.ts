// nestInstall.ts

import { displayInSidebar, setType, TextInputInterface } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestInstall from "./nestInstall";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export default defineCodeNode({
  type: "nest.Install",
  title: "install",
  inputs: {
    module_name: () =>
      new TextInputInterface("module name", "nestmlmodule").use(setType, stringType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `nest.Install("${this.node.inputs.module_name.value}")`;
  },
});

export const addNESTInstallNode = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Install").length;

  const codeNode = graph.addNodeAtColumn(nestInstall, -2, 200 + 290 * idx);
  if (idx === 0) codeNode.state.comments = "Install modules";
  return codeNode;
};

export const loadNESTInstallNodes = (graph: CodeGraph | NESTCodeGraph, modulesProps: string[]): void => {
  modulesProps.forEach((moduleProps: string) => {
    const codeNode = addNESTInstallNode(graph);
    codeNode.inputs.module_name.value = moduleProps;
  });
};
