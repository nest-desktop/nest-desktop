// norseLIParameters.ts

import { NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { liParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LIParameters",
  title: "LI Parameters",
  inputs: {
    tau_syn_inv: () => new NumberInterface("tau_syn_inv", 200),
    tau_mem_inv: () => new NumberInterface("tau_mem_inv", 100),
    v_leak: () => new NumberInterface("v_leak", 0),
  },
  outputs: {
    out: () => new NodeOutputInterface().use(setType, liParametersType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    if (this.node.inputs.tau_syn_inv.value !== 200)
      args.push(`tau_syn_inv=torch.tensor(${this.node.inputs.tau_syn_inv.value})`);
    if (this.node.inputs.tau_mem_inv.value !== 100)
      args.push(`tau_mem_inv=torch.tensor(${this.node.inputs.tau_mem_inv.value})`);
    if (this.node.inputs.v_leak.value !== 0) args.push(`v_leak=torch.tensor(${this.node.inputs.v_leak.value})`);

    return args.length > 0 ? `norse.torch.LIParameters(\n\t${args.join(",\n\t")}\n)` : "norse.torch.LIParameters()";
  },
  variableName: "p",
});
