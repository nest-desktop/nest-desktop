// network.ts

import type { Class, TConnection, TConnections, TModel, TNode, TNodes, TProject } from "@/types";
import { BaseObj, type IBaseState } from "@/core";

import { BaseConnections, type IConnectionState } from "./connection";
import { BaseNode, BaseNodes, type INodeState, type INodeViewState } from "./node";

import { NetworkState } from "./helpers/networkState";
import { NetworkRevision } from "./helpers";

export interface INetworkState extends IBaseState {
  nodes?: INodeState[];
  connections?: IConnectionState[];
}

const elementTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi:mdi-all-inclusive", id: "all", title: "all" },
  { icon: "mdi:mdi-select-group", id: "group", title: "group" },
  { icon: "graph:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "graph:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "graph:recorder", id: "recorder", title: "recorder" },
];

export class BaseNetwork<TState extends INetworkState = INetworkState> extends BaseObj<TState> {
  private _state: NetworkState; // network state

  public _connections: TConnections;
  public _nodes: TNodes;
  public _project: TProject; // parent
  private _revision: NetworkRevision;

  constructor(project: TProject) {
    super({ config: { name: "Network" } });

    this._project = project;
    this._state = new NetworkState(this);
    this._revision = new NetworkRevision(this);

    this._nodes = new this.Nodes(this);
    this._connections = new this.Connections(this);
  }

  get Connections(): Class<BaseConnections> {
    return BaseConnections;
  }

  get Nodes(): Class<BaseNodes> {
    return BaseNodes;
  }

  get colors(): string[] {
    return this.config?.localStorage.color.cycle;
  }

  // set colors(value: string[]) {
  //   const color: { cycle: string[]; scheme: string } = this.config?.localStorage.color;
  //   color.cycle = value;
  //   this.config?.localStorage.update({ color });
  // }

  get connections(): TConnections {
    return this._connections;
  }

  get elementTypes() {
    return elementTypes;
  }

  get isEmpty(): boolean {
    return this.nodes.all.length === 0 && this.connections.all.length === 0;
  }

  get nodes(): TNodes {
    return this._nodes;
  }

  get project(): TProject {
    return this._project;
  }

  get revision(): NetworkRevision {
    return this._revision;
  }

  get state(): NetworkState {
    return this._state;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.logger.trace("clean");

    this.nodes.clean();
    this.connections.clean();
  }

  /**
   * Clear the network.
   */
  clear(): void {
    this.logger.trace("clear");

    this.connections.clear();
    this.nodes.clear();
  }

  /**
   * Connect node components by user interaction.
   * @param sourceId ID of source node
   * @param targetId ID of target node
   * @remarks When it connects to a recorder, it initializes activity graph.
   */
  connectNodes(sourceIdx: number, targetIdx: number): TConnection | undefined {
    this.logger.trace("connect nodes");

    // Add connection.
    const connection: TConnection = this.connections.newConnection({
      sourceIdx,
      targetIdx,
    });

    // Clean connection.
    connection.clean();

    // Correct connections with recorder.
    // if (connection.view.connectRecorder()) connection.recorder?.correctRecorderConnections();

    // // Update synaptic weight label.
    // if (connection.sourceNode.isNode && connection.sourceNode.view.state.synWeights)
    //   connection.synapse.weightLabel = connection.sourceNode.view.state.synWeights;

    // // Update recorder and clean activity panels.
    // if (connection.view.connectRecorder()) connection.recorder.updateRecorder();

    return connection;
  }

  /**
   * Create node component by user interaction.
   * @param model model name of default models
   * @param view node view props
   */
  createNode(model?: string, viewState?: INodeViewState): BaseNode | undefined {
    this.logger.trace("create node");

    return this.nodes.newNode({
      model: model,
      view: viewState,
    });
  }

  /**
   * Delete connection component from the network.
   * @param connection connection instance
   * @remarks It update recorder.
   */
  deleteConnection(connection: TConnection): void {
    this.logger.trace("delete connection");

    connection.view.connectRecorder();

    // Remove connection from the list.
    this.connections.remove(connection);

    // Update recorder.
    if (connection.view.connectRecorder()) connection.recorder?.updateRecorder();
  }

  /**
   * Delete node component from the network.
   * @param node node instance
   */
  deleteNode(node: TNode): void {
    this.logger.trace("delete node");

    // let cleanPanels = node.isRecorded;
    // if (node.isNode) {
    //   const nodeItem = node as TNode;
    //   cleanPanels = nodeItem.model.isRecorder || node.isRecorded;
    // }
    const recorders = node.connectedRecorders;

    // Remove connection from the list.
    this.connections.removeByNode(node);

    // Remove node in node groups
    // this.nodes.removeNodeInNodeGroups(node);

    // Remove node from the list.
    this.nodes.remove(node);

    // Clean node groups.
    // this.nodes.cleanNodeGroups();

    // Update recorder.
    if (recorders.length > 0) recorders.forEach((recorder: TNode) => recorder.updateRecorder());
  }

  /**
   * Get models of the element type.
   * @param elementType string
   * @returns a list of models
   */
  getModelsByElementType(elementType: string): TModel[] {
    return this.project.modelDBStore.getModelsByElementType(elementType);
  }

  /**
   * Get node color.
   * @param idx index of color cycle
   * @returns node color name
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config?.localStorage.color.cycle;
    return colors[idx % colors.length] ?? "black";
  }

  // /**
  //  * Initialize network.
  //  * @remarks Do not use it in the constructor.
  //  */
  // init(): void {
  //   this.logger.trace("init");

  //   this.nodes.init();
  //   this.connections.init();

  //   // Initialize network history.
  //   // this.revision.init();

  //   this.clean();
  // }

  // /**
  //  * Load network from state.
  //  * @param networkState network state
  //  */
  // load(networkState: INetworkState): void {
  //   this.logger.trace("load");

  //   this.clear();

  //   this.nodes.load(networkState.nodes);
  //   this.connections.load(networkState.connections);

  //   // this.init();
  // }

  /**
   * Save network to state.
   * @return network state
   */
  override save(): INetworkState {
    return {
      connections: this.connections.save(),
      nodes: this.nodes.save(),
    };
  }

  /**
   * Update node style, e.g. node color.
   */
  updateStyle(): void {
    this.logger.trace("update node style");
    if (this.nodes.all.length === 0) return;

    this.nodes.all.forEach((node: TNode) => node.view.updateStyle());
  }
}
