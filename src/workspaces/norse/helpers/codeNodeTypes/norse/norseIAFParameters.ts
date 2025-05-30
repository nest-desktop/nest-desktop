// norseLIFParameters.ts

import { displayInSidebar, NumberInterface, setType } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { iafParametersType } from "./interfaceTypes";

const getParam = (node: AbstractCodeNode, name: string): string => {
  const outputInterface = node.getConnectedOutputInterfaceByInterface(name);
  if (outputInterface) {
    if (outputInterface.node?.type !== "torch.tensor")
      return `${name}=torch.tensor(${node.code?.graph.formatInterfaceLabels([outputInterface]).join(", ")})`;
    else return `${name}=${node.code?.graph.formatInterfaceLabels([outputInterface]).join(", ")}`;
  } else return `${name}=torch.tensor(${node.inputs[name].value})`;
};

export default defineCodeNode({
  type: "norse.torch.IAFParameters",
  modules: ["torch"],
  title: "IAF Parameters",
  inputs: {
    v_th: () => new NumberInterface("v_th", 1).use(displayInSidebar, true).setHidden(true),
    v_reset: () => new NumberInterface("v_reset", 0).use(displayInSidebar, true).setHidden(true),
    alpha: () => new NumberInterface("alpha", 100).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface().use(setType, iafParametersType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    Object.keys(this.node.inputs).forEach((paramKey) => {
      if (!this.node || this.node.inputs[paramKey].hidden) return;
      args.push(getParam(this.node, paramKey));
    });

    return args.length > 0 ? `norse.torch.IAFParameters(\n\t${args.join(",\n\t")}\n)` : "norse.torch.IAFParameters()";
  },
  variableName: "p",
});
