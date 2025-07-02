// nestDataResponse.ts

import { displayInSidebar } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "nest/response",
  title: "nest data response",
  inputs: {
    events: () => new NodeInputInterface("events"),
    positions: () => new NodeInputInterface("positions").use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const events = this.node.getConnectedOutputInterfacesByInterface("events");
    if (events.length > 0) responseData.push(`"events": [${formatInterfaceLabels(events).join(", ")}]`);

    const positions = this.node.getConnectedNodesByInterface("positions");
    const getPositions = positions.map((pos) => `pos(${pos.label})`);
    // if (getPositions.length === 1) responseData.push(`"positions": ${getPositions.join(", ")}`);
    if (getPositions.length > 0) responseData.push(`"positions": {${getPositions.map((p) => "**" + p).join(", ")}}`);

    if (responseData.length === 0) return "response = {}";
    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});
