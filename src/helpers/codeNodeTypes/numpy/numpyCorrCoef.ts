// numpyCorrCoef.ts

import { setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.corrcoef",
  title: "correlation coefficients",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x").use(setType, arrayType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const x = this.node.getConnectedOutputInterfaceByInterface("x");
    if (x) args.push(`x=${this.code?.graph.formatInterfaceLabel(x)}`);

    return `np.corrcoef(${args.join(", ")})`;
  },
  variableName: "corrcoef",
});
