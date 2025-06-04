// codeGraph.ts

import { Graph, IBaklavaViewModel, IGraphState, NodeInterface, useBaklava } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseObj } from "@/helpers/common/base";
import { setViewSettings } from "@/plugins/baklava";
import functionNode from "@/helpers/codeNodeTypes/base/function";

// import { BaseCode } from "../code/code";
import nestDataResponse from "../codeNodeTypes/nest/nestDataResponse";
import nestInstall from "../codeNodeTypes/nest/nestInstall";
import nestResetKernel from "../codeNodeTypes/nest/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nest/nestSetKernelStatus";
import nestSimulate from "../codeNodeTypes/nest/nestSimulate";
import { INESTNetworkProps } from "../network/network";
import { INESTProjectProps } from "../project/project";
import { INESTSimulationKernelProps } from "../simulation/simulationKernel";
import { INESTSimulationProps } from "../simulation/simulation";
import { connectNodes } from "../codeNodeTypes/nest/nestConnect";
import { copyNodeModels, copySynapseModels } from "../codeNodeTypes/nest/nestCopyModel";
import { createNodes } from "../codeNodeTypes/nest/nestCreate";

export class NESTCodeGraph extends BaseObj {
  private _viewModel: IBaklavaViewModel;

  constructor(networkProps: INESTNetworkProps) {
    super();
    // this.logger.settings.minLevel = 1;

    this._viewModel = useBaklava();
    setViewSettings(this._viewModel);

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

  /**
   * Add code node at column.
   * @param nodeType
   * @param col column
   * @param offset number
   * @param props optional
   * @returns Abstract code node
   */
  addNodeAtColumn(
    nodeType: new () => AbstractCodeNode,
    col: number = 0,
    offset: number = 100,
    props?: unknown,
  ): AbstractCodeNode {
    const left = 300;
    const width = 350;
    const space = 70;

    const node = new nodeType();
    if (props) node.props = props;

    this.addNode(node);
    if (node.position) {
      node.position.x = left + col * (width + space);
      node.position.y = offset;
    }

    return node;
  }

  /**
   * Add code node at coordinates.
   * @param nodeType
   * @param position position
   * @param props optional
   * @returns Abstract code node
   */
  addNodeAtCoordinates(
    nodeType: new () => AbstractCodeNode,
    position: { x: number; y: number } = { x: 0, y: 0 },
    props?: unknown,
  ): AbstractCodeNode {
    const node = new nodeType();
    if (props) node.props = props;

    this.addNode(node);
    if (node.position) node.position = position;

    return node;
  }

  /**
   * Add code nodes from network props.
   */
  addNetworkCodeNodes(networkProps: INESTNetworkProps): void {
    this.logger.trace("add network code nodes");
    if (!networkProps) return;
    let nodes;

    if (networkProps.models) copyNodeModels(this, networkProps.models);
    nodes = createNodes(this, networkProps.nodes);

    // add node parameter interfaces
    // nodes.all.forEach((node) => {
    //   const paramsNode = node.getConnectedNodeByInterface("params");
    //   if (paramsNode)
    //     paramsNode.state.props?.forEach((prop) => (paramsNode.inputs[prop.id] = createParameterInterface(prop)));
    // });

    copySynapseModels(this, networkProps.models, nodes.weightRecorders);
    nodes = connectNodes(this, networkProps.connections, nodes.all);

    // add synapse parameter interfaces
    // nodes.forEach((node) => {
    //   const paramsNode = node.getConnectedNodeByInterface("syn_spec");
    //   if (paramsNode)
    //     paramsNode.state.props?.forEach((prop) => (paramsNode.inputs[prop.id] = createParameterInterface(prop)));
    // });
  }

  /**
   * Add code node for reset kernel.
   */
  addResetKernelCodeNode(): void {
    // nest.ResetKernel
    this.addNodeAtColumn(nestResetKernel, -2, 100);
  }

  /**
   * Add code node for response.
   */
  addResponseCodeNode(): void {
    const codeNodes = this.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create");
    const spatialNodes = codeNodes.filter((node: AbstractCodeNode) => !node.inputs.positions.hidden);
    if (spatialNodes.length > 0) {
      if (!this.nodes.find((node: AbstractCodeNode) => node.type === "function")) {
        const funcNode = this.addNodeAtColumn(functionNode, 4, 900);
        funcNode.inputs.code.hidden = false;
        funcNode.inputs.code.value = "pos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
      }
    }

    const responseNode = this.addNodeAtColumn(nestDataResponse, 4, 600);

    codeNodes.forEach((codeNode: AbstractCodeNode) => {
      if (!codeNode.inputs.model.value.includes("recorder") && !codeNode.inputs.model.value.includes("meter")) return;
      this.addConnection(codeNode.outputs.events, responseNode.inputs.events);
    });

    if (spatialNodes.length > 0 && responseNode.inputs.positions)
      spatialNodes.forEach((spatialNode: AbstractCodeNode) =>
        this.addConnection(spatialNode.outputs.positions, responseNode.inputs.positions),
      );
  }

  /**
   * Add code nodes from simulation props.
   */
  addSimulationCodeNode(simulationProps: INESTSimulationProps): void {
    this.logger.trace("add simulation code nodes");
    // nest.Simulate
    const codeNode = this.addNodeAtColumn(nestSimulate, 4, 100);
    codeNode.state.comments = "Run simulation";
    codeNode.inputs.time.value = simulationProps?.time ?? 1000;
  }

  addSimulationKernelCodeNode(kernelProps?: INESTSimulationKernelProps): void {
    // nest.SetKernelStatus
    const codeNode = this.addNodeAtColumn(nestSetKernelStatus, -2, 200);
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
    if (projectProps.simulation?.modules) this.addNodeAtColumn(nestInstall, -2, 200);

    // nest.SetKernelStatus
    if (projectProps.simulation?.kernel) this.addSimulationKernelCodeNode(projectProps.simulation.kernel);

    // nest.Create & nest.Connect
    if (projectProps.network) this.addNetworkCodeNodes(projectProps.network);

    // nest.Simulate
    if (projectProps.simulation) this.addSimulationCodeNode(projectProps.simulation);

    this.addResponseCodeNode();
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
