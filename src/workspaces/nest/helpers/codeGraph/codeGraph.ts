// codeGraph.ts

import { Graph, IBaklavaViewModel, IGraphState, NodeInterface, useBaklava } from "baklavajs";

import functionNode from "@/helpers/codeNodeTypes/base/function";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseObj } from "@/helpers/common/base";

// import { BaseCode } from "../code/code";
import nestDataResponse from "../codeNodeTypes/nest/nestDataResponse";
import nestInstall from "../codeNodeTypes/nest/nestInstall";
import nestResetKernel from "../codeNodeTypes/nest/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nest/nestSetKernelStatus";
import nestSimulate from "../codeNodeTypes/nest/nestSimulate";
import { INESTNetworkProps } from "../network/network";
import { INESTProjectProps } from "../project/project";
import { INESTSimulationProps } from "../simulation/simulation";
import { copyNodeModels, createNodes } from "./nodes";
import { connectNodes, copySynapseModels } from "./connections";
import { setViewSettings } from "@/plugins/baklava";
import { INESTSimulationKernelProps } from "../simulation/simulationKernel";

export class NESTCodeGraph extends BaseObj {
  private _viewModel: IBaklavaViewModel;

  constructor(networkProps: INESTNetworkProps) {
    super();

    this._viewModel = useBaklava();
    setViewSettings(this._viewModel.settings);

    this.load(networkProps);
  }

  get graph(): Graph {
    return this._viewModel.displayedGraph;
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  get viewModel(): IBaklavaViewModel {
    return this._viewModel;
  }

  addConnection(from: NodeInterface, to: NodeInterface): void {
    from.hidden = false;
    to.hidden = false;
    this.graph.addConnection(from, to);
  }

  addNode(node: AbstractCodeNode): void {
    this.graph.addNode(node);
  }

  addNodeAtColumn(nodeType: new () => AbstractCodeNode, col: number = 0, offset: number = 100) {
    const left = 300;
    const width = 350;
    const space = 70;

    const node = new nodeType();
    this.addNode(node);
    if (node.position) {
      node.position.x = left + col * (width + space);
      node.position.y = offset;
    }

    return node;
  }

  /**
   * Add code nodes from network props.
   */
  addNetworkCodeNodes(networkProps: INESTNetworkProps): void {
    this.logger.trace("add network code nodes");
    if (!networkProps) return;

    copyNodeModels(this, networkProps.models);
    const nodes = createNodes(this, networkProps.nodes);

    copySynapseModels(this, networkProps.models, nodes.weightRecorders);
    connectNodes(this, networkProps.connections, nodes.all);

    // define function getPos
    if (nodes.spatial.length > 0) {
      const posNode = this.addNodeAtColumn(functionNode, 3, 800);
      // posNode.inputs.code.value = "def getPos(n): return dict(zip(n.global_id, nest.GetPosition(n)))";
      posNode.inputs.code.value = "getPos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
    }
  }

  addResetKernelCodeNode(): void {
    // nest.ResetKernel
    this.addNodeAtColumn(nestResetKernel, 0, 100);
  }

  addResponeCodeNode(): void {
    const responseNode = this.addNodeAtColumn(nestDataResponse, 3, 600);
    const codeNodes = this.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create");

    codeNodes.forEach((codeNode: AbstractCodeNode) => {
      if (!["recorder", "meter"].includes(codeNode.inputs.model.value)) return;
      this.addConnection(codeNode.outputs.events, responseNode.inputs.events);
    });
  }

  /**
   * Add code nodes from simulation props.
   */
  addSimulationCodeNode(simulationProps: INESTSimulationProps): void {
    this.logger.trace("add simulation code nodes");
    // nest.Simulate
    const codeNode = this.addNodeAtColumn(nestSimulate, 0, 450);
    codeNode.state.comments = "Run simulation";
    codeNode.inputs.time.value = simulationProps?.time ?? 1000;
  }

  addSimulationKernelCodeNode(kernelProps?: INESTSimulationKernelProps): void {
    // nest.SetKernelStatus
    const codeNode = this.addNodeAtColumn(nestSetKernelStatus, 0, 200);
    codeNode.state.comments = "Set simulation kernel";
    if (kernelProps) {
      codeNode.inputs.local_num_threads.value = kernelProps.localNumThreads;
      codeNode.inputs.local_num_threads.hidden = kernelProps.localNumThreads === 1;
      codeNode.inputs.resolution.value = kernelProps.resolution;
      codeNode.inputs.resolution.hidden = kernelProps.resolution === 0.1;
      codeNode.inputs.rng_seed.value = kernelProps.rngSeed;
      codeNode.inputs.rng_seed.hidden = false;
    }
  }

  load(projectProps: INESTProjectProps): void {
    this.addResetKernelCodeNode();

    // nest.Install
    if (projectProps.simulation?.modules) this.addNodeAtColumn(nestInstall, 0, 200);

    // nest.SetKernelStatus
    if (projectProps.simulation?.kernel) this.addSimulationKernelCodeNode(projectProps.simulation.kernel);

    // nest.Create & nest.Connect
    if (projectProps.network) this.addNetworkCodeNodes(projectProps.network);

    // nest.Simulate
    if (projectProps.simulation) this.addSimulationCodeNode(projectProps.simulation);

    this.addResponeCodeNode();
  }

  save(): IGraphState {
    this.logger.trace("save");
    const graph = this.graph.save();
    this.saveStates(graph);
    return graph;
  }

  saveStates(graph: IGraphState): void {
    graph.nodes.forEach((node, nodeIdx) => {
      const integrated = this.graph.nodes[nodeIdx].state.integrated;
      if (integrated) node.integrated = integrated;

      Object.entries(node.inputs).forEach(([k, v]) => (v.hidden = this.graph.nodes[nodeIdx].inputs[k].hidden));
      Object.entries(node.outputs).forEach(([k, v]) => (v.hidden = this.graph.nodes[nodeIdx].outputs[k].hidden));
    });
  }
}
