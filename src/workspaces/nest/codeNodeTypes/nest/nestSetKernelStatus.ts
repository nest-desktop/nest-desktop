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
  type ICodeNodeParamState,
  updateNESTParameterNode,
  updateParameterInterfaces,
} from "./nestParameters";
import { updateRecords } from "@/utils";

export interface INESTKernelState {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

const defaultKernelParamState: Record<string, ICodeNodeParamState> = {
  local_num_threads: {
    id: "local_num_threads",
    component: "IntegerInterface",
    value: 1,
    min: 1,
  },
  resolution: {
    id: "resolution",
    component: "NumberInterface",
    value: 0.1,
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  rng_seed: {
    id: "rng_seed",
    component: "IntegerInterface",
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
  beforeRun() {
    if (!this.code || !this.code.project) return;
    this.code.project.simulation.kernel.registerCodeNode(this);
  },
  onConnected() {
    updateParameterInterfaces(this, "params", defaultKernelParamState);
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
  kernelState?: Record<string, ICodeNodeParamState>,
): AbstractCodeNode => {
  const codeNode = getNESTSetKernelStatusNode(graph);

  return getNESTParameterNode(codeNode, "params", kernelState);
};

export const loadNESTSetKernelStatusNode = (
  graph: CodeGraph,
  kernelState?: Record<string, ICodeNodeParamState>,
): AbstractCodeNode => {
  const codeNode = getNESTSetKernelStatusNode(graph);

  updateNESTParameterNode(
    codeNode,
    "params",
    kernelState ? updateRecords<ICodeNodeParamState>(defaultKernelParamState, kernelState) : defaultKernelParamState,
  );

  return codeNode;
};
