// numpyLinspace.ts

import { NumberInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.linspace",
  title: "linspace",
  inputs: {
    start: () => new NumberInterface("start", 0).use(setType, numberType),
    stop: () => new NumberInterface("stop", 1).use(setType, numberType),
    num: () => new NumberInterface("num", 50).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword = "";

    const start = this.node.getConnectedOutputInterfaceByInterface("start");
    if (start.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(start).join(", ")}`);
    else if (this.node.inputs.start.value !== 0) args.push(`${this.node.inputs.start.value}`);

    const stop = this.node.getConnectedOutputInterfaceByInterface("stop");
    if (stop.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(stop).join(", ")}`);
    else args.push(`${this.node.inputs.stop.value}`);

    keyword = args.length < 2 ? "num=" : "";
    const num = this.node.getConnectedOutputInterfaceByInterface("num");
    if (num.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(num).join(", ")}`);
    else if (this.node.inputs.num.value !== 50) args.push(`${keyword}${this.node.inputs.num.value}`);

    return `np.linspace(${args.join(", ")})`;
  },
  variableName: "values",
});
