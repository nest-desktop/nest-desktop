// numpyFull.ts

import { IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

import { arrayType, INumpyArray } from "./interfaceTypes";
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

    const shape = this.node.getConnectedOutputInterfaceByInterface("shape");
    if (shape != undefined) args.push(`shape=${formatInterfaceLabel(shape)}`);
    else args.push(`shape=${this.node.inputs.shape.value}`);

    const fill_value = this.node.getConnectedOutputInterfaceByInterface("fill_value");
    if (fill_value != undefined) args.push(`fill_value=${formatInterfaceLabel(fill_value)}`);
    else args.push(`fill_value=${this.node.inputs.fill_value.value}`);

    return `np.full(${args.join(", ")})`;
  },
  variableName: "values",
});
