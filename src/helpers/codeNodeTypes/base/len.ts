// text.ts

import { setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { numberType } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

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
    if (list.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(list).join(", ")}`);

    return `len(${args.join(", ")})`;
  },
  variableName: "n",
});
