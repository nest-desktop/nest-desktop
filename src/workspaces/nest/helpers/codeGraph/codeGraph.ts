// codeGraph.ts

import toposort from "toposort";
import { Connection, Graph, IBaklavaViewModel, IEditorState, INodeState, NodeInterface, useBaklava } from "baklavajs";

import functionNode from "@/helpers/codeNodeTypes/base/function";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseObj } from "@/helpers/common/base";
import { setViewSettings } from "@/plugins/baklava";

import nestDataResponse from "../codeNodeTypes/nest/nestDataResponse";
import nestInstall from "../codeNodeTypes/nest/nestInstall";
import nestResetKernel from "../codeNodeTypes/nest/nestResetKernel";
import nestSetKernelStatus from "../codeNodeTypes/nest/nestSetKernelStatus";
import nestSimulate from "../codeNodeTypes/nest/nestSimulate";
import { INESTNetworkProps } from "../network/network";
import { INESTNodeProps } from "../node/node";
import { INESTProjectProps } from "../project/project";
import { INESTSimulationKernelProps } from "../simulation/simulationKernel";
import { INESTSimulationProps } from "../simulation/simulation";
import { addNESTCreateNode } from "../codeNodeTypes/nest/nestCreate";
import { addNESTCopyModel, addNESTCopySynapseModel } from "../codeNodeTypes/nest/nestCopyModel";
import { INESTConnectionProps } from "../connection/connection";
import { addNESTConnectNode } from "../codeNodeTypes/nest/nestConnect";
import { INESTCopyModelProps } from "../model/copyModel";

export class NESTCodeGraph extends BaseObj {
  private _viewModel: IBaklavaViewModel;

  constructor(projectProps: INESTProjectProps) {
    super();
    // this.logger.settings.minLevel = 1;

    this._viewModel = useBaklava();
    setViewSettings(this._viewModel);

    this.load(projectProps);
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  get graph(): Graph {
    return this._viewModel.displayedGraph;
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values as AbstractCodeNode[];
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

    if (networkProps.models) {
      const nodeModels = networkProps.models.filter(
        (modelProps: INESTCopyModelProps) => !modelProps.existing.includes("synapse"),
      );

      if (nodeModels) nodeModels.forEach((modelProps: INESTCopyModelProps) => addNESTCopyModel(this, modelProps));
    }

    let nestNodes: AbstractCodeNode[] = [];
    if (networkProps.nodes)
      nestNodes = networkProps.nodes.map((nodeProps: INESTNodeProps) => addNESTCreateNode(this, nodeProps));

    if (networkProps.models) {
      const synapseModels = networkProps.models.filter((modelProps: INESTCopyModelProps) =>
        modelProps.existing.includes("synapse"),
      );

      if (synapseModels) {
        const weightRecorders: AbstractCodeNode[] = nestNodes.filter(
          (codeNode: AbstractCodeNode) => codeNode.inputs.model.value === "weight_recorder",
        );
        synapseModels.forEach((modelProps: INESTCopyModelProps) =>
          addNESTCopySynapseModel(this, modelProps, weightRecorders),
        );
      }
    }

    if (networkProps.connections)
      networkProps.connections.forEach((connectionProps: INESTConnectionProps) =>
        addNESTConnectNode(this, connectionProps, nestNodes),
      );
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

    this.nodes
      .filter((node: AbstractCodeNode) => node.type === "nest.Simulate")
      .forEach((node: AbstractCodeNode) => this.addConnection(node.outputs._node, responseNode.inputs._node));
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

    this.nodes
      .filter((node: AbstractCodeNode) => node.type === "nest.Connect")
      .forEach((node: AbstractCodeNode) => this.addConnection(node.outputs._node, codeNode.inputs._node));
  }

  /**
   * Add code nodes from simulation kernel props.
   */
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

  /**
   * Load code graph.
   */
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

  /**
   * Save code graph.
   * @returns graph state
   */
  save(): IEditorState {
    this.logger.trace("save");

    this.sortNodes();

    // const graphState = this.graph.save();
    // this.saveNodeStates(graphState.nodes);

    const editorState = this._viewModel.editor.save();
    this.saveNodeStates(editorState.graph.nodes);
    return editorState;
  }

  /**
   * Save node states.
   * @param nodeStates a list of node state.
   */
  saveNodeStates(nodeStates: INodeState<unknown, unknown>[]): void {
    nodeStates.forEach((nodeState: INodeState<unknown, unknown>, nodeIdx) => {
      const node = this.nodes[nodeIdx] as AbstractCodeNode;
      nodeState.integrated = node.state.integrated;

      Object.entries(nodeState.inputs).forEach(([inputKey]) => {
        if (node.inputs[inputKey]) nodeState.inputs[inputKey].hidden = node.inputs[inputKey].hidden;
      });

      Object.entries(nodeState.outputs).forEach(([outputKey]) => {
        if (node.inputs[outputKey]) nodeState.outputs[outputKey].hidden = node.outputs[outputKey].hidden;
      });
    });
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    if (this.nodes.length === 0 || this.connections.length === 0) return;
    this.logger.trace("sort nodes");

    try {
      // Get a list of edges
      const edges: [string, string | undefined][] = this.connections
        // .filter(
        //   (connection: Connection) =>
        //     this.graph.findNodeById(connection.from.nodeId).outputs.node.id === connection.from.id &&
        //     this.graph.findNodeById(connection.to.nodeId).inputs.node.id === connection.to.id,
        // )
        .map((connection: Connection) => [connection.from.nodeId, connection.to.nodeId]);

      // Get a list of node
      const nodes = this.nodes.map((node: AbstractCodeNode) => node.id);

      // Get sorted node ids
      const nodeIds = toposort.array(nodes, edges);

      // Update sorted nodes
      this.nodes = nodeIds.map((nodeId: string) => this.graph.findNodeById(nodeId)) as AbstractCodeNode[];
    } catch {
      this.logger.warn("Sorting nodes failed.");
    }
  }
}
