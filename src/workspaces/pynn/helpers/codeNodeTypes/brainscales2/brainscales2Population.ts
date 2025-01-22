// brainscales2Population.ts

import { IntegerInterface, SelectInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

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
    if (cellclass.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(cellclass).join(", ")}`);
    else args.push(`${this.node.inputs.cellclass.value}()`);

    return `pynn.Population(${args.join(", ")})`;
  },
  variableName: "node",
});
