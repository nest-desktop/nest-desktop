// nestSimulate.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { NESTCode } from "../../code/code";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "nest.Simulate",
  title: "simulate",
  inputs: {
    time: () => new IntegerInterface("time", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const time = this.node.getConnectedOutputInterfaceByInterface("time");
    if (time.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(time).join(", ")}`);
    else args.push(`${this.node.inputs.time.value}`);

    return `nest.Simulate(${args.join(",")})`;
  },
  onPlaced() {
    if (!this.node.code) return;
    const code = this.node.code as NESTCode;
    this.simulationItem = code.project.simulation;
    this.simulationItem.codeNodes.node = this;
  },
});
