// norseLIFParameters.ts

import { NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { lifParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LIFParameters",
  title: "LIF Parameters",
  inputs: {
    tau_syn_inv: () => new NumberInterface("tau_syn_inv", 200),
    tau_mem_inv: () => new NumberInterface("tau_mem_inv", 100),
    v_leak: () => new NumberInterface("v_leak", 0),
    v_th: () => new NumberInterface("v_th", 1),
    v_reset: () => new NumberInterface("v_reset", 0),
  },
  outputs: {
    out: () => new NodeOutputInterface().use(setType, lifParametersType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    if (this.node.inputs.tau_syn_inv.value !== 200)
      args.push(`tau_syn_inv=torch.tensor(${this.node.inputs.tau_syn_inv.value})`);
    if (this.node.inputs.tau_mem_inv.value !== 100)
      args.push(`tau_mem_inv=torch.tensor(${this.node.inputs.tau_mem_inv.value})`);
    if (this.node.inputs.v_leak.value !== 0) args.push(`v_leak=torch.tensor(${this.node.inputs.v_leak.value})`);
    if (this.node.inputs.v_th.value !== 1) args.push(`v_th=torch.tensor(${this.node.inputs.v_th.value})`);
    if (this.node.inputs.v_reset.value !== 0) args.push(`v_reset=torch.tensor(${this.node.inputs.v_reset.value})`);

    return args.length > 0 ? `norse.torch.LIFParameters(\n\t${args.join(",\n\t")}\n)` : "norse.torch.LIFParameters()";
  },
  variableName: "p",
});
