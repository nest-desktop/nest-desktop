// norseSequentialState.ts

import { IntegerInterface, NodeInterface } from "baklavajs";

import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineDynamicCodeNode({
  type: "norse.torch.SequentialState",
  title: "sequential state",
  inputs: {
    nModules: () => new IntegerInterface("number of modules", 1).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "model",
  codeTemplate() {
    if (!this.node) return this.type;

    const nodes = this.node.getConnectedNodes("inputs");
    if (this.node.inputs.nModules.value != nodes.length + 1) this.node.inputs.nModules.value = nodes.length + 1;
    if (nodes.length === 0) return "norse.torch.SequentialState()";
    const nodeCodeTemplates = nodes.map((node) => (node.state.integrated ? node.codeTemplate : node.label));
    return `norse.torch.SequentialState(\n\t${nodeCodeTemplates.join(",\n\t")}\n)`;
  },
  onUpdate() {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    const nModules = this.inputs?.nModules.value ?? 1;
    for (let i = 0; i < nModules; i++) {
      inputs["module" + i + 1] = () => new NodeInterface(`module${i + 1}`, "");
    }

    return { inputs, outputs };
  },
});
