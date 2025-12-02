// nestSetKernelStatus.ts

import {
  CodeNodeInputInterface,
  defineCodeNode,
  getPositionAtColumn,
  type CodeGraph,
  type AbstractCodeNode,
} from "@babsey/code-graph";

import {
  getNESTParameterNode,
  type IParamState,
  updateNESTParameterNode,
  updateParameterInterfaces,
} from "./nestParameters";
import { updateRecords } from "@/utils";

export interface INESTKernelState {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

const defaultKernelState: Record<string, IParamState> = {
  local_num_threads: {
    value: 1,
    min: 1,
  },
  resolution: {
    component: "NumberInterface",
    value: 0.1,
    min: 0.1,
  },
  rng_seed: {
    value: 1,
    min: 1,
  },
};

export const nestSetKernelStatus = defineCodeNode({
  type: "nest.SetKernelStatus",
  title: "set kernel status",
  inputs: {
    params: () => new CodeNodeInputInterface("params", ""),
  },
  afterGraphLoaded() {
    if (!this.code.project) return;
    this.code.project.simulation.kernel.registerCodeNode(this);
  },
  onConnected() {
    updateParameterInterfaces(this, "params", defaultKernelState);
  },
});

export const addNESTSetKernelStatusNode = (graph: CodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(new nestSetKernelStatus(), getPositionAtColumn(-2, 200));
  // codeNode.state.comments = "Set simulation kernel";
  return codeNode;
};

export const getNESTSetKernelStatusNode = (graph: CodeGraph): AbstractCodeNode => {
  const codeNode = graph.findNodeByType("nest.SetKernelStatus");
  if (!codeNode) return addNESTSetKernelStatusNode(graph);
  return codeNode;
};

export const getNESTSetKernelStatusParameterNode = (
  graph: CodeGraph,
  kernelState?: Record<string, IParamState>,
): AbstractCodeNode => {
  const codeNode = getNESTSetKernelStatusNode(graph);

  return getNESTParameterNode(codeNode, "params", kernelState);
};

export const loadNESTSetKernelStatusNode = (
  graph: CodeGraph,
  kernelState?: Record<string, IParamState>,
): AbstractCodeNode => {
  const codeNode = getNESTSetKernelStatusNode(graph);

  updateNESTParameterNode(
    codeNode,
    "params",
    kernelState ? updateRecords<IParamState>(defaultKernelState, kernelState) : defaultKernelState,
  );

  return codeNode;
};
