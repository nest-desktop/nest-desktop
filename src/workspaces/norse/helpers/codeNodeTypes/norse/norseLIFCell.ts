// norseLIFCell.ts

import { CheckboxInterface, setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { lifParametersType } from "./interfaceTypes";

export default defineCodeNode({
  type: "norse.torch.LIFCell",
  title: "LIF cell",
  inputs: {
    p: () => new NodeInputInterface("p").use(setType, lifParametersType),
    record_states: () => new CheckboxInterface("record_states", false),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const nodes = this.node.getConnectedOutputInterfaceByInterface("p");
    if (nodes.length > 0) args.push(`p=${this.code?.graph.formatInterfaceLabels(nodes).join(", ")}`);
    if (this.node.inputs.record_states.value) args.push(`record_states=True`);

    return `norse.torch.LIFCell(${args.join(", ")})`;
  },
  variableName: "model",
});
