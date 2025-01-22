// humamSimulation.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

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
    if (simDict.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(simDict).join(", ")}`);

    const netDict = this.node.getConnectedOutputInterfaceByInterface("net_dict");
    if (netDict.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(netDict).join(", ")}`);

    return `humam.Simulation(${args.join(", ")})`;
  },
});
