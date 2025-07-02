// humamSynapseNumbers.ts

import { NumberInterface, TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "humam.SynapseNumbers",
  title: "synapse numbers",
  variableName: "sn",
  inputs: {
    connectivity: () => new TextInputInterface("connectivity", ""),
    NN: () => new NodeInputInterface("NN"),
    conn_path: () => new TextInputInterface("conn path", ""),
    vol_path: () => new TextInputInterface("vol path", ""),
    FLN: () => new NumberInterface("FLN", 0),
    rho_syn: () => new NumberInterface("rho_syn", 0),
    Z_i: () => new NumberInterface("Z i", 0),
    SLN_FF: () => new NumberInterface("SLN FF", 0),
    SLN_FB: () => new NumberInterface("SLN FB", 0),
    lambda: () => new NumberInterface("lambda", 0),
    a0: () => new NumberInterface("a0", 0),
    a1: () => new NumberInterface("a1", 0),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const connectivity = this.node.getConnectedOutputInterfaceByInterface("connectivity");
    if (connectivity != undefined) args.push(`${formatInterfaceLabel(connectivity)}`);
    else args.push(`${this.node.inputs.connectivity.value}`);

    const NN = this.node.getConnectedOutputInterfaceByInterface("NN");
    if (NN != undefined) args.push(`${formatInterfaceLabel(NN)}`);

    const connPath = this.node.getConnectedOutputInterfaceByInterface("conn_path");
    if (connPath != undefined) args.push(`${formatInterfaceLabel(connPath)}`);
    else args.push(`${this.node.inputs.conn_path.value}`);

    const volPath = this.node.getConnectedOutputInterfaceByInterface("vol_path");
    if (volPath != undefined) args.push(`${formatInterfaceLabel(volPath)}`);
    else args.push(`${this.node.inputs.vol_path.value}`);

    const FLN = this.node.getConnectedOutputInterfaceByInterface("FLN");
    if (FLN != undefined) args.push(`${formatInterfaceLabel(FLN)}`);
    else args.push(`${this.node.inputs.FLN.value}`);

    const rhoSyn = this.node.getConnectedOutputInterfaceByInterface("rho_syn");
    if (rhoSyn != undefined) args.push(`${formatInterfaceLabel(rhoSyn)}`);
    else args.push(`${this.node.inputs.rho_syn.value}`);

    const ZI = this.node.getConnectedOutputInterfaceByInterface("Z_i");
    if (ZI != undefined) args.push(`${formatInterfaceLabel(ZI)}`);
    else args.push(`${this.node.inputs.Z_i.value}`);

    const SLN_FF = this.node.getConnectedOutputInterfaceByInterface("SLN_FF");
    if (SLN_FF != undefined) args.push(`${formatInterfaceLabel(SLN_FF)}`);
    else args.push(`${this.node.inputs.SLN_FF.value}`);

    const SLN_FB = this.node.getConnectedOutputInterfaceByInterface("SLN_FB");
    if (SLN_FB != undefined) args.push(`${formatInterfaceLabel(SLN_FB)}`);
    else args.push(`${this.node.inputs.SLN_FB.value}`);

    const lambda = this.node.getConnectedOutputInterfaceByInterface("lambda");
    if (lambda != undefined) args.push(`${formatInterfaceLabel(lambda)}`);
    else args.push(`${this.node.inputs.lambda.value}`);

    const a0 = this.node.getConnectedOutputInterfaceByInterface("a0");
    if (a0 != undefined) args.push(`${formatInterfaceLabel(a0)}`);
    else args.push(`${this.node.inputs.a0.value}`);

    const a1 = this.node.getConnectedOutputInterfaceByInterface("a1");
    if (a1 != undefined) args.push(`${formatInterfaceLabel(a1)}`);
    else args.push(`${this.node.inputs.a1.value}`);

    return `humam.SynapseNumbers(${args.join(", ")})`;
  },
});
