// pynnNESTPopulation.ts

import { IntegerInterface, SelectInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "pyNN.Population",
  modules: ["pyNN.nest"],
  title: "Population",
  inputs: {
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
    cellclass: () =>
      new SelectInterface("cellclass", "pyNN.nest.IF_curr_alpha", [
        "pyNN.nest.IF_cond_alpha",
        "pyNN.nest.IF_curr_alpha",
      ]),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    args.push(`${this.node.inputs.size.value}`);

    const cellclass = this.node.getConnectedOutputInterfacesByInterface("cellclass");
    if (cellclass && cellclass.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(cellclass).join(", ")}`);
    else args.push(`${this.node.inputs.cellclass.value}()`);

    return `pyNN.nest.Population(${args.join(", ")})`;
  },
  variableName: "node",
});
