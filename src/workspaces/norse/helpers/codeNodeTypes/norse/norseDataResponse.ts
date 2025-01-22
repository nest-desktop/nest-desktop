// norseDataResponse.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

export default defineCodeNode({
  type: "norse/response",
  title: "norse data response",
  inputs: {
    outputs: () => new NodeInputInterface("outputs"),
    states: () => new NodeInputInterface("states"),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const outputs = this.node
      .getConnectedNodesByInterface("outputs")
      .map((node: AbstractCodeNode) => `${this.code?.graph.formatLabels([node])[0]}[0]`);
    if (outputs.length > 0) responseData.push(`"outputs": [${outputs.join(", ")}]`);

    const states = this.node.getConnectedNodesByInterface("states").map((node: AbstractCodeNode) => `${node.label}[1]`);
    if (states.length > 0) responseData.push(`"states": [${states.join(", ")}]`);

    return responseData.length > 0 ? `response = {\n\t${responseData.join(",\n\t")}\n}` : "response = {}";
  },
  onCreate() {
    this.state.role = "last";
  },
});
