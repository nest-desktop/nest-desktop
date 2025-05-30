// response.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "plotly/response",
  title: "plotly response",
  inputs: {
    plotly: () => new NodeInputInterface("plotly"),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const plotly = this.node
      .getConnectedOutputInterfacesByInterface("plotly")
      .map((node: NodeOutputInterface) => `${node.label}`);
    if (plotly.length > 0) responseData.push(`"plotly": ${plotly.join(", ")}.to_plotly_json()`);

    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
