// text.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

import { numberType } from "./interfaceTypes";

export default defineCodeNode({
  type: "len",
  title: "len",
  inputs: {
    list: () => new NodeInputInterface("list"),
  },
  outputs: {
    out: () => new NodeOutputInterface<number>().use(setType, numberType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const list = this.node.getConnectedOutputInterfaceByInterface("list");
    if (list != undefined) args.push(`${formatInterfaceLabel(list)}`);

    return `len(${args.join(", ")})`;
  },
  variableName: "n",
});
