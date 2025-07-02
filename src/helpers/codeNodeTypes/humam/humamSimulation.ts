// humamSimulation.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "humam.Simulation",
  title: "simulation",
  variableName: "sim",
  inputs: {
    sim_dict: () => new NodeInputInterface("sim dict"),
    net_dict: () => new NodeInputInterface("net dict"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const simDict = this.node.getConnectedOutputInterfaceByInterface("sim_dict");
    if (simDict != undefined) args.push(`${formatInterfaceLabel(simDict)}`);

    const netDict = this.node.getConnectedOutputInterfaceByInterface("net_dict");
    if (netDict != undefined) args.push(`${formatInterfaceLabel(netDict)}`);

    return `humam.Simulation(${args.join(", ")})`;
  },
});
