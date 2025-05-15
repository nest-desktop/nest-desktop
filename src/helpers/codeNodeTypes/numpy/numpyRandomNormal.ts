// numpyRandomNormal.ts

import { IntegerInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.normal",
  title: "random normal distribution",
  inputs: {
    loc: () => new IntegerInterface("loc", 0).use(setType, numberType),
    scale: () => new IntegerInterface("scale", 1).use(setType, numberType),
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword = "";

    const loc = this.node.getConnectedOutputInterfaceByInterface("loc");
    if (loc.length > 0) args.push(`loc=${this.code?.graph.formatInterfaceLabels(loc).join(", ")}`);
    else if (this.node.inputs.loc.value !== 0) args.push(`loc=${this.node.inputs.loc.value}`);

    keyword = args.length < 1 ? "scale=" : "";
    const scale = this.node.getConnectedOutputInterfaceByInterface("scale");
    if (scale.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(scale).join(", ")}`);
    else if (this.node.inputs.scale.value !== 1) args.push(`${keyword}${this.node.inputs.scale.value}`);

    keyword = args.length < 2 ? "size=" : "";
    const size = this.node.getConnectedOutputInterfaceByInterface("size");
    if (size.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(size).join(", ")}`);
    else if (this.node.inputs.size.value !== 1) args.push(`${keyword}${this.node.inputs.size.value}`);

    return `np.random.normal(${args.join(", ")})`;
  },
  variableName: "normal",
});
