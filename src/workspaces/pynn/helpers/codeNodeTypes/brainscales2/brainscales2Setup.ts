// brainscales2Setup.ts

import { displayInSidebar, NumberInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

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
    if (timestep.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(timestep).join(", ")}`);
    else if (this.node.inputs.timestep.value > 0.000034) args.push(`${this.node.inputs.timestep.value}`);

    return `pynn.setup(${args.join(", ")})`;
  },
});
