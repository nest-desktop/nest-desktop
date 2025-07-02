// nestSimulate.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import { NESTCode } from "../../code/code";
import { NESTSimulation } from "../../simulation/simulation";

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
    if (time != undefined) args.push(`${formatInterfaceLabel(time)}`);
    else args.push(`${this.node.inputs.time.value}`);

    return `nest.Simulate(${args.join(",")})`;
  },
  onGraphUpdate() {
    if (!this.node || !this.node.simulationItem) return;
    const simulation: NESTSimulation = this.node.simulationItem as NESTSimulation;

    if (simulation.time !== this.node.inputs.time.value) simulation.time = this.node.inputs.time.value;
  },
  onPlaced() {
    if (!this.node || !this.node.code) return;
    const code = this.node.code as NESTCode;
    this.node.simulationItem = code.project.simulation;
    this.node.simulationItem.codeNodes.node = this;
  },
  onProjectUpdate() {
    if (!this.node || !this.node.simulationItem) return;
    const simulation: NESTSimulation = this.node.simulationItem as NESTSimulation;

    if (this.node.inputs.time.value !== simulation.time) this.node.inputs.time.value = simulation.time;
  },
});
