// listComprehension.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { numberType } from "./interfaceTypes";

export default defineCodeNode({
  type: "range",
  title: "range",
  inputs: {
    start: () => new IntegerInterface("start", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    stop: () => new IntegerInterface("stop", 1).use(setType, numberType),
    step: () => new IntegerInterface("step", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    Object.keys(this.node.inputs).forEach((paramKey) => {
      if (!this.node || this.node.inputs[paramKey].hidden) return;

      keyword = args.length < 2 && paramKey === "step" ? "step=" : "";
      args.push(`${keyword}${this.node.getInputValue(paramKey)}`);
    });

    return `range(${args.join(",")})`;
  },
});
