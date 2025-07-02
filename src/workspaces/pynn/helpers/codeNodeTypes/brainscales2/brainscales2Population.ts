// brainscales2Population.ts

import { IntegerInterface, SelectInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "brainscales2.Population",
  title: "Population",
  inputs: {
    size: () => new IntegerInterface("size", 1).use(setType, numberType),
    cellclass: () => new SelectInterface("cellclass", "pynn.cells.HXNeuron", ["pynn.cells.HXNeuron"]),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    args.push(`${this.node.inputs.size.value}`);

    const cellclass = this.node.getConnectedOutputInterfaceByInterface("cellclass");
    if (cellclass != undefined) args.push(`${formatInterfaceLabel(cellclass)}`);
    else args.push(`${this.node.inputs.cellclass.value}()`);

    return `pynn.Population(${args.join(", ")})`;
  },
  variableName: "node",
});
