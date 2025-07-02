// numpyArgwhere.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

import { arrayType, INumpyArray } from "./interfaceTypes";

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
    if (a != undefined) args.push(`${formatInterfaceLabel(a)}`);

    return `np.argwhere(${args.join(", ")})`;
  },
});
