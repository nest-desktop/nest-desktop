// elephantHomogeneousGammaProcess.ts

import { CheckboxInterface, displayInSidebar, IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { booleanType, numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.spike_train_generation.homogeneous_gamma_process",
  modules: ["quantities"],
  title: "homogeneous gamma process",
  inputs: {
    a: () => new IntegerInterface("a", 3).use(setType, numberType),
    b: () => new IntegerInterface("b", 10).use(setType, numberType),
    t_start: () =>
      new NumberInterface("t_start", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    t_stop: () =>
      new NumberInterface("t_stop", 1000).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    nd_array: () =>
      new CheckboxInterface("nd_array", false).use(setType, booleanType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    times: () => new NodeOutputInterface("times", ".times"),
    size: () => new NodeOutputInterface("size", ".size"),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const a = this.node.getConnectedOutputInterfacesByInterface("a");
    if (a.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(a).join(", ")}`);
    else args.push(`${this.node.inputs.a.value}`);

    const b = this.node.getConnectedOutputInterfacesByInterface("b");
    if (b.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(b).join(", ")}*pq.Hz`);
    else args.push(`${this.node.inputs.b.value}*pq.Hz`);

    const t_start = this.node.getConnectedOutputInterfacesByInterface("t_start");
    if (t_start.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(t_start).join(", ")}*pq.ms`);
    else if (this.node.inputs.t_start.value > 0) args.push(`${this.node.inputs.t_start.value}*pq.ms`);

    keyword = args.length < 2 ? "t_stop=" : "";
    const t_stop = this.node.getConnectedOutputInterfacesByInterface("t_stop");
    if (t_stop.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(t_stop).join(", ")}*pq.ms`);
    else if (this.node.inputs.t_stop.value !== 1000) args.push(`${keyword}${this.node.inputs.t_stop.value}*pq.ms`);

    return `elephant.spike_train_generation.homogeneous_gamma_process(${args.join(", ")})`;
  },
  variableName: "spiketrain",
});
