// nestSetKernelStatus.ts

import { displayInSidebar, IntegerInterface, NumberInterface, setType } from "baklavajs";

import { NESTCode } from "../../code/code";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "nest.SetKernelStatus",
  title: "set kernel status",
  inputs: {
    local_num_threads: () =>
      new IntegerInterface("Local number of threads", 1, 1)
        .use(setType, numberType)
        .use(displayInSidebar, true)
        .setHidden(true),
    resolution: () =>
      new NumberInterface("Resolution", 0.1, 0.001, 10)
        .use(setType, numberType)
        .use(displayInSidebar, true)
        .setHidden(true),
    rng_seed: () =>
      new IntegerInterface("RNG Seed", 1, 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const localNumThreads = this.node.getConnectedOutputInterfaceByInterface("local_num_threads");
    if (localNumThreads.length > 0)
      args.push(`"local_num_threads": ${this.code?.graph.formatInterfaceLabels(localNumThreads).join(", ")}`);
    else if (!this.node.inputs.local_num_threads.hidden)
      args.push(`"local_num_threads": ${this.node.inputs.local_num_threads.value}`);

    const resolution = this.node.getConnectedOutputInterfaceByInterface("resolution");
    if (resolution.length > 0)
      args.push(`"resolution": ${this.code?.graph.formatInterfaceLabels(resolution).join(", ")}`);
    else if (!this.node.inputs.resolution.hidden) args.push(`"resolution": ${this.node.inputs.resolution.value}`);

    const rngSeed = this.node.getConnectedOutputInterfaceByInterface("rng_seed");
    if (rngSeed.length > 0) args.push(`"rng_seed": ${this.code?.graph.formatInterfaceLabels(rngSeed).join(", ")}`);
    else if (!this.node.inputs.rng_seed.hidden) args.push(`"rng_seed": ${this.node.inputs.rng_seed.value}`);

    return args.length > 0 ? `nest.SetKernelStatus({\n\t${args.join(",\n\t")}\n})` : "";
  },
  onPlaced() {
    if (!this.code) return;
    const code = this.code as NESTCode;
    this.simulationItem = code.project.simulation.kernel;
    this.simulationItem.codeNodes.node = this;
  },
});
