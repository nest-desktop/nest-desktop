// numpyConvolve.ts

import { SelectInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { stringType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.convolve",
  title: "convolve",
  inputs: {
    a: () => new NodeInputInterface<INumpyArray>("a").use(setType, arrayType),
    v: () => new NodeInputInterface<INumpyArray>("v").use(setType, arrayType),
    mode: () => new SelectInterface("mode", "valid", ["valid", "same", "full"]).use(setType, stringType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const a = this.node.getConnectedOutputInterfaceByInterface("a");
    if (a) args.push(`a=${this.code?.graph.formatInterfaceLabel(a)}`);

    const v = this.node.getConnectedOutputInterfaceByInterface("v");
    if (v) args.push(`v=${this.code?.graph.formatInterfaceLabel(v)}`);

    const mode = this.node.getConnectedOutputInterfacesByInterface("mode");
    if (mode.length > 0) args.push(`mode=${this.code?.graph.formatInterfaceLabels(mode).join(", ")}`);
    else if (this.node.inputs.mode.value !== "valid") args.push(`mode=${this.node.inputs.mode.value}`);

    return `np.convolve(${args.join(", ")})`;
  },
  variableName: "conv",
});
