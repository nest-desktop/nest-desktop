// plotlyBar.ts

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "plotly.graph_objects.Bar",
  title: "Bar",
  inputs: {
    x: () => new NodeInputInterface("x"),
    y: () => new NodeInputInterface("y"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  variableName: "bar",
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [];

    const x = this.node.getConnectedOutputInterfaceByInterface("x");
    if (x != undefined) args.push(`x=${formatInterfaceLabel(x)}`);

    const y = this.node.getConnectedOutputInterfaceByInterface("y");
    if (y != undefined) args.push(`y=${formatInterfaceLabel(y)}`);

    return `go.Bar(${args.join(", ")})`;
  },
});
