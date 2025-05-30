// numpyConcatenate.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { arrayType, INumpyArray } from "./interfaceTypes";

export default defineCodeNode({
  type: "numpy.concatenate",
  title: "concatenate",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a").use(setType, arrayType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedOutputInterfaceByInterface("a");
    if (a) args.push(`${this.code?.graph.formatInterfaceLabels([a]).join(", ")}`);

    return `np.concatenate(${args.join(", ")})`;
  },
  variableName: "concat",
});
