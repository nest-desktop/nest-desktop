// numpyArgwhere.ts

import { setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.argwhere",
  title: "argwhere",
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
    if (a.length > 0 && this.code) args.push(`${this.code?.graph.formatInterfaceLabels(a).join(", ")}`);

    return `np.argwhere(${args.join(", ")})`;
  },
});
