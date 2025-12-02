// network.ts

import { BaseNetwork, INetworkState, INodeViewState } from "@/network";
import type { Class, TNetworkState } from "@/types";

import type { NESTConnection } from "./connection";
import type { NESTModel } from "../model";
import type { NESTProject } from "../project";
import { NESTConnections } from "./connection";
import { NESTCopyModels, type INESTCopyModelState, type NESTCopyModel } from "./copyModel";
import { type NESTNode, NESTNodes } from "./node";
import { loadNESTConnectNode, loadNESTCreateNode } from "../codeNodeTypes/nest";

export interface INESTNetworkState extends INetworkState {
  models?: INESTCopyModelState[];
}

const defaultModels: Record<string, string> = {
  neuron: "iaf_psc_alpha",
  recorder: "voltmeter",
  stimulator: "dc_generator",
};

const elementTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi:mdi-all-inclusive", id: "all", title: "all" },
  { icon: "mdi:mdi-select-group", id: "group", title: "group" },
  { icon: "graph:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "graph:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "graph:recorder", id: "recorder", title: "recorder" },
  { icon: "nest:copy-model", id: "model", title: "model" },
];

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function isNESTNetworkState(networkState: TNetworkState): networkState is INESTNetworkState {
  return (networkState as INESTNetworkState).models != undefined;
}

export class NESTNetwork extends BaseNetwork<INESTNetworkState> {
  private _copyModels: NESTCopyModels; // for nest.CopyModel

  constructor(project: NESTProject) {
    super(project);

    this._copyModels = new NESTCopyModels(this);
  }

  override get Connections(): Class<NESTConnections> {
    return NESTConnections;
  }

  override get Nodes(): Class<NESTNodes> {
    return NESTNodes;
  }

  override get connections(): NESTConnections {
    return this._connections as NESTConnections;
  }

  override get elementTypes() {
    return elementTypes;
  }

  override get isEmpty(): boolean {
    return this.copyModels.all.length === 0 && this.nodes.all.length === 0 && this.connections.all.length === 0;
  }

  /**
   * Get copied models
   */
  get models(): NESTCopyModels {
    return this._copyModels;
  }

  get copyModels(): NESTCopyModels {
    return this._copyModels;
  }

  // override get hashObject(): IBaseState {
  //   return {
  //     models: this.copyModels.all.map((model: NESTCopyModel) => model.hash),
  //     nodes: this.nodes.all.map((node: TNode | TNodeGroup) => node.hash),
  //     connections: this.connections.all.map((connection: NESTConnection) => connection.hash),
  //   };
  // }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  override get nodes(): NESTNodes {
    return this._nodes as NESTNodes;
  }

  /**
   * Get synapse models.
   * @returns a list of synapse models
   */
  get synapseModels(): (NESTModel | NESTCopyModel)[] {
    this.logger.trace("get synapse models by element type");

    return this.project.modelDBStore.getModelsByElementType("synapse");
  }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");

    this.connections.clean();
    this.nodes.clean();
    this.copyModels.clean();
  }

  /**
   * Clear the network.
   */
  override clear(): void {
    this.logger.trace("clear");

    this.connections.clear();
    this.nodes.clear();
    this.copyModels.clear();
  }

  /**
   * Connect node components by user interaction.
   * @param sourceId ID of source node
   * @param targetId ID of target node
   *
   * @remarks When it connects to a recorder, it initializes activity graph.
   */
  override connectNodes(sourceIdx: number, targetIdx: number): NESTConnection {
    this.logger.trace("connect nodes");

    // Add connection.
    const codeNode = loadNESTConnectNode(
      this.project.code.graph,
      {
        sourceIdx,
        targetIdx,
      },
      this.nodes.codeNodes,
    );

    // Initialize connection.
    // connection.init();

    // Correct connections with recorder.
    // if (connection.view.connectRecorder()) connection.recorder.correctRecorderConnections();

    // // Update synaptic weight label.
    // if (connection.sourceNode.isNode && connection.sourceNode.view.state.synWeights)
    //   connection.synapse.weightLabel = connection.sourceNode.view.state.synWeights;

    // // Update recorder and clean activity panels.
    // if (connection.view.connectRecorder()) connection.recorder.updateRecorder();

    // Trigger network change.
    // this.changes({ cleanPanels: connection.view.connectRecorder(), preventSimulation: true });

    return codeNode.mask;
  }

  /**
   * Create node component by user interaction.
   * @param model model name of default models
   * @param viewState node view props
   */
  override createNode(model?: string, viewState?: INodeViewState): NESTNode {
    this.logger.trace("create node");
    console.log(viewState);

    // Load create node.
    const codeNode = loadNESTCreateNode(this.project.code.graph, {
      model: model || defaultModels[viewState?.elementType || "neuron"],
      view: viewState,
    });

    // Trigger network change.
    // this.changes({ preventSimulation: true });

    return codeNode.mask;
  }

  /**
   * Delete model component from the network.
   * @param model NEST copy model
   *
   * @remarks
   * It emits network changes.
   */
  deleteModel(model: NESTCopyModel): void {
    this.logger.trace("delete copy model");

    // Remove model from the list.
    this.copyModels.remove(model);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this._project.initActivityGraph();
  }

  /**
   * Get node models of the element type.
   * @param elementType string
   * @returns a list of models
   */
  getNodeModelsByElementType(elementType: string): (NESTModel | NESTCopyModel)[] {
    this.logger.trace("get node models by element type", elementType);
    return elementType === "copied"
      ? this.copyModels.filterByGeneralElementType("node")
      : this.project.modelDBStore.getModelsByElementType(elementType);
  }

  /**
   * Initialize network.
   * @remarks Do not use it in the constructor.
   */
  override init(): void {
    this.logger.trace("init");

    this.nodes.init();
    this.connections.init();
    this.copyModels.init();

    // this.updateHash();

    this.clean();
  }

  /**
   * Update network component.
   * @param network network state
   */
  override load(networkState: INESTNetworkState): void {
    this.logger.trace("update");

    this.clear();

    if (networkState.models) this.copyModels.load(networkState.models);
    this.nodes.load(networkState.nodes);
    this.connections.load(networkState.connections);

    this.init();
  }

  /**
   * Save nest network to state.
   * @return nest network state
   */
  override save(): INESTNetworkState {
    return {
      connections: this.connections.save(),
      models: this.copyModels.save(),
      nodes: this.nodes.save(),
    };
  }
}
