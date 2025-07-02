// brainscales2Setup.ts

import { displayInSidebar, NumberInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "brainscales2.setup",
  title: "setup",
  inputs: {
    timestep: () => new NumberInterface("timestep", 0.000034).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const timestep = this.node.getConnectedOutputInterfaceByInterface("timestep");
    if (timestep != undefined) args.push(`${formatInterfaceLabel(timestep)}`);
    else if (this.node.inputs.timestep.value > 0.000034) args.push(`${this.node.inputs.timestep.value}`);

    return `pynn.setup(${args.join(", ")})`;
  },
});
