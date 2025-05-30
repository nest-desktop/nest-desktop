// numpyRandomNormal.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.normal",
  title: "random normal distribution",
  inputs: {
    loc: () => new IntegerInterface("loc", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    scale: () => new IntegerInterface("scale", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    size: () => new IntegerInterface("size", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword = "";

    Object.keys(this.node.inputs).forEach((paramKey) => {
      if (!this.node || this.node.inputs[paramKey].hidden) return;

      keyword =
        args.length < 1 && paramKey === "scale" ? "scale=" : args.length < 2 && paramKey === "size" ? "size=" : "";

      args.push(`${keyword}${this.node.getInputValue(paramKey)}`);
    });

    return `np.random.normal(${args.join(", ")})`;
  },
  variableName: "normal",
});
