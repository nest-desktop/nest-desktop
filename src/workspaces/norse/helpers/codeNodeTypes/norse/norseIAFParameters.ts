// norseLIFParameters.ts

import { NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { iafParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.IAFParameters",
  title: "IAF Parameters",
  inputs: {
    v_th: () => new NumberInterface("v_th", 1).use(setType, numberType),
    v_reset: () => new NumberInterface("v_reset", 0).use(setType, numberType),
    alpha: () => new NumberInterface("alpha", 100).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface().use(setType, iafParametersType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    if (this.node.inputs.v_th.value !== 1) args.push(`v_th=torch.tensor(${this.node.inputs.v_th.value})`);
    if (this.node.inputs.v_reset.value !== 0) args.push(`v_reset=torch.tensor(${this.node.inputs.v_reset.value})`);
    if (this.node.inputs.alpha.value !== 100) args.push(`alpha=torch.tensor(${this.node.inputs.alpha.value})`);

    return args.length > 0 ? `norse.torch.IAFParameters(\n\t${args.join(",\n\t")}\n)` : "norse.torch.IAFParameters()";
  },
  variableName: "p",
});
