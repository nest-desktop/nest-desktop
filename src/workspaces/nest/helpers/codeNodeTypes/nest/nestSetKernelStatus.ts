// nestSetKernelStatus.ts

import { displayInSidebar, IntegerInterface, NumberInterface, setType } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph, findNodeByType } from "@/helpers/codeGraph/codeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestSetKernelStatus from "./nestSetKernelStatus";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTKernelProps {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

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
    if (localNumThreads != undefined) args.push(`"local_num_threads": ${formatInterfaceLabel(localNumThreads)}`);
    else if (!this.node.inputs.local_num_threads.hidden)
      args.push(`"local_num_threads": ${this.node.inputs.local_num_threads.value}`);

    const resolution = this.node.getConnectedOutputInterfaceByInterface("resolution");
    if (resolution != undefined) args.push(`"resolution": ${formatInterfaceLabel(resolution)}`);
    else if (!this.node.inputs.resolution.hidden) args.push(`"resolution": ${this.node.inputs.resolution.value}`);

    const rngSeed = this.node.getConnectedOutputInterfaceByInterface("rng_seed");
    if (rngSeed) args.push(`"rng_seed": ${formatInterfaceLabel(rngSeed)}`);
    else if (!this.node.inputs.rng_seed.hidden) args.push(`"rng_seed": ${this.node.inputs.rng_seed.value}`);

    return args.length > 0 ? `nest.SetKernelStatus({\n\t${args.join(",\n\t")}\n})` : "";
  },
  onPlaced() {
    if (!this.node || !this.code) return;

    if (!this.node.code.project.simulation.kernel) return;
    this.node.view = this.node.code.project.simulation.kernel;
    this.node.view.codeNodes.node = this;
  },
});

export const addNESTSetKernelStatusNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestSetKernelStatus, -2, 200);
  codeNode.state.comments = "Set simulation kernel";
  return codeNode;
};

export const getNESTSetKernelStatusNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = findNodeByType(graph, "nest.SetKernelStatus");
  if (!codeNode) return addNESTSetKernelStatusNode(graph);
  return codeNode;
};

export const loadNESTSetKernelStatusNode = (
  graph: CodeGraph | NESTCodeGraph,
  kernelProps?: INESTKernelProps,
): AbstractCodeNode => {
  const codeNode = getNESTSetKernelStatusNode(graph);
  codeNode.state.props = kernelProps;
  if (kernelProps) codeNode.updateValues(kernelProps);

  return codeNode;
};
