// network.ts

import { TConnection, TConnections, TModel, TNetworkGraph, TNode, TNodeGroup, TNodes, TProject } from "@/types";

import { BaseConnections } from "../connection/connections";
import { BaseNodes } from "../node/nodes";
import { BaseObj } from "../common/base";
import { IConnectionProps } from "../connection/connection";
import { INodeGroupProps } from "../node/nodeGroup";
import { INodeProps } from "../node/node";
import { INodeViewProps } from "../node/nodeView";
import { NetworkState } from "./networkState";
import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";

export interface INetworkProps {
  nodes?: (INodeProps | INodeGroupProps)[];
  connections?: IConnectionProps[];
}

const _elementTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi:mdi-all-inclusive", id: "all", title: "all" },
  { icon: "mdi:mdi-select-group", id: "group", title: "group" },
  { icon: "network:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "network:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "network:recorder", id: "recorder", title: "recorder" },
];

export class BaseNetwork extends BaseObj {
  private _state: NetworkState; // network state

  public _connections: TConnections;
  public _nodes: TNodes;
  public _project: TProject; // parent

  private _defaultModels: Record<string, string> = {
    neuron: "iaf_psc_alpha",
    recorder: "voltmeter",
    stimulator: "dc_generator",
  };

  constructor(project: TProject, networkProps: INetworkProps = {}) {
    super({
      config: { name: "Network" },
    });

    this._project = project;
    this._state = new NetworkState(this);

    this._nodes = new this.Nodes(this, networkProps.nodes || []);
    this._connections = new this.Connections(this, networkProps.connections || []);
  }

  get Connections() {
    return BaseConnections;
  }

  get Nodes() {
    return BaseNodes;
  }

  get colors(): string[] {
    return this.config?.localStorage.color.cycle;
  }

  set colors(value: string[]) {
    const color: { cycle: string[]; scheme: string } = this.config?.localStorage.color;
    color.cycle = value;
    this.config?.localStorage.update({ color });
  }

  get connections(): TConnections {
    return this._connections;
  }

  set defaultModels(value: Record<string, string>) {
    this._defaultModels = value;
  }

  get elementTypes() {
    return _elementTypes;
  }

  get graph(): TNetworkGraph {
    const networkGraphStore = useNetworkGraphStore();
    return networkGraphStore.state.graph as TNetworkGraph;
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

  get state(): NetworkState {
    return this._state;
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It commits the network in the network history.
   * It emits project changes.
   */
  changes(props = {}): void {
    this.logger.trace("changes");

    this.updateStyle();
    this.updateHash();

    this.project.changes(props);
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
   * @param sourceIdx node index
   * @param targetIdx node index
   * @remarks When it connects to a recorder, it initializes activity graph.
   */
  connectNodes(sourceIdx: number, targetIdx: number): void {
    this.logger.trace("connect nodes");

    // Add connection.
    const connection: TConnection | undefined = this.connections.addConnection({
      source: sourceIdx,
      target: targetIdx,
    });

    // Initialize connection.
    connection.init();

    // Correct connections with recorder.
    if (connection.view.connectRecorder()) connection.recorder.correctRecorderConnections();

    // Update synaptic weight label.
    if (connection.sourceNode.isNode && connection.sourceNode.view.state.synWeights)
      connection.synapse.weightLabel = connection.sourceNode.view.state.synWeights;

    // Update recorder and clean activity panels.
    if (connection.view.connectRecorder()) connection.recorder.updateRecorder();

    // Trigger network change.
    this.changes({ cleanPanels: connection.view.connectRecorder(), preventSimulation: true });
  }

  /**
   * Create node component by user interaction.
   * @param model model name of default models
   * @param view node view props
   */
  createNode(model?: string, view?: INodeViewProps): void {
    this.logger.trace("create node");

    // Add node.
    const node = this.nodes.addNode({
      model: model || this._defaultModels[view?.elementType || "neuron"],
      view,
    });

    // Initialize node.
    node.init();

    // Trigger network change.
    this.changes({ preventSimulation: true });
  }

  /**
   * Delete connection component from the network.
   * @param connection connection object
   * @remarks It update recorder and emits network changes.
   */
  deleteConnection(connection: TConnection): void {
    this.logger.trace("delete connection");

    const cleanPanels = connection.view.connectRecorder();

    // Remove connection from the list.
    this.connections.remove(connection);

    // Update recorder.
    if (connection.view.connectRecorder()) connection.recorder.updateRecorder();

    // Trigger network change.
    this.changes({ cleanPanels, preventSimulation: true });
  }

  /**
   * Delete node component from the network.
   * @param node node or node group object
   * @remarks It emits network changes.
   */
  deleteNode(node: TNode | TNodeGroup): void {
    this.logger.trace("delete node");

    let cleanPanels = node.isRecorded;
    if (node.isNode) {
      const nodeItem = node as TNode;
      cleanPanels = nodeItem.model.isRecorder || node.isRecorded;
    }
    const recorders = node.connectedRecorders;

    // Remove connection from the list.
    this.connections.removeByNode(node);

    // Remove node in node groups
    this.nodes.removeNodeInNodeGroups(node);

    // Remove node from the list.
    this.nodes.remove(node);

    // Clean node groups.
    this.nodes.cleanNodeGroups();

    // Update recorder.
    if (recorders.length > 0) recorders.forEach((recorder: TNode) => recorder.updateRecorder());

    // Trigger network change.
    this.changes({ cleanPanels, preventSimulation: true });
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
    return colors[idx % colors.length];
  }

  /**
   * Initialize network.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.nodes.init();
    this.connections.init();

    this.updateStyle();
    this.updateHash();
  }

  /**
   * Serialize for JSON.
   * @return network props
   */
  toJSON(): INetworkProps {
    return {
      connections: this.connections.toJSON(),
      nodes: this.nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   * @param networkProps network props
   */
  update(networkProps: INetworkProps): void {
    this.logger.trace("update");

    this.clear();

    this.nodes.update(networkProps.nodes);
    this.connections.update(networkProps.connections);

    this.init();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      nodes: this.nodes.all.map((node: TNode | TNodeGroup) => node.hash),
      connections: this.connections.all.map((connection: TConnection) => connection.hash),
    });
  }

  /**
   * Update node style, e.g. node color.
   */
  updateStyle(): void {
    this.logger.trace("update node style");

    this._nodes.all.forEach((node: TNode | TNodeGroup) => node.view.updateStyle());
  }
}
