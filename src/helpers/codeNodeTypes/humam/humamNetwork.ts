// humamNetwork.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { displayInSidebar } from "baklavajs";

export default defineCodeNode({
  type: "humam.Network",
  title: "network",
  variableName: "net",
  inputs: {
    NN: () => new NodeInputInterface("neuron numbers"),
    SN: () => new NodeInputInterface("synapse numbers"),
    params: () => new NodeInputInterface("params").use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const nn = this.node.getConnectedOutputInterfaceByInterface("NN");
    if (nn.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(nn).join(", ")}`);

    const sn = this.node.getConnectedOutputInterfaceByInterface("SN");
    if (sn.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(sn).join(", ")}`);

    const params = this.node.getConnectedOutputInterfaceByInterface("params");
    if (params.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(params).join(", ")}`);

    return `humam.Network(${args.join(", ")})`;
  },
});
