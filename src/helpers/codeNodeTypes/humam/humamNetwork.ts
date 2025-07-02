// humamNetwork.ts

import { displayInSidebar } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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
    if (nn != undefined) args.push(`${formatInterfaceLabel(nn)}`);

    const sn = this.node.getConnectedOutputInterfaceByInterface("SN");
    if (sn != undefined) args.push(`${formatInterfaceLabel(sn)}`);

    const params = this.node.getConnectedOutputInterfaceByInterface("params");
    if (params != undefined) args.push(`${formatInterfaceLabel(params)}`);

    return `humam.Network(${args.join(", ")})`;
  },
});
