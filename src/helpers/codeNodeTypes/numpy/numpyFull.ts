// numpyFull.ts

import { IntegerInterface, NumberInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.full",
  title: "full",
  inputs: {
    shape: () => new IntegerInterface("shape", 1).use(setType, numberType),
    fill_value: () => new NumberInterface("fill_value", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const shape = this.node.getConnectedOutputInterfacesByInterface("shape");
    if (shape.length > 0) args.push(`shape=${this.code?.graph.formatInterfaceLabels(shape).join(", ")}`);
    else args.push(`shape=${this.node.inputs.shape.value}`);

    const fill_value = this.node.getConnectedOutputInterfacesByInterface("fill_value");
    if (fill_value.length > 0) args.push(`fill_value=${this.code?.graph.formatInterfaceLabels(fill_value).join(", ")}`);
    else args.push(`fill_value=${this.node.inputs.fill_value.value}`);

    return `np.full(${args.join(", ")})`;
  },
  variableName: "values",
});
