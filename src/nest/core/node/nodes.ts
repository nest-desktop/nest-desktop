// networkNodes.ts

import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { logger as mainLogger } from "@/utils/logger";

import { Node, NodeProps } from "./node";
import { Network } from "../network/network";

interface NodesState {
  annotations: { [key: string]: string }[];
  elementTypeIdx: number;
  focusedNode: Node | null;
  hash: string;
  nodesLength: number;
  selectedNode: Node | null;
}

export class Nodes {
  private _logger: Logger<ILogObj>;
  private _network: Network; // parent
  private _nodes: Node[] = [];
  private _state: UnwrapRef<NodesState>; //reactive state

  constructor(network: Network, nodes?: NodeProps[]) {
    this._network = network;

    this._logger = mainLogger.getSubLogger({
      name: `[${this._network.project.shortId}] nodes`,
    });

    this._state = reactive({
      annotations: [],
      elementTypeIdx: 0,
      focusedNode: null,
      hash: "",
      nodesLength: 0,
      selectedNode: null,
    });

    this.init(nodes);
  }

  get annotations(): any {
    return this._state.annotations;
  }

  get all(): Node[] {
    return this._nodes;
  }

  get filter() {
    return this._nodes.filter;
  }

  /**
   * Check if the network has some nodes with compartments
   */
  get hasSomeNodeCompartments(): boolean {
    return this._nodes.some((node: Node) => node.compartments.length > 0);
  }

  /**
   * Check if the network has some nodes with receptors
   */
  get hasSomeNodeReceptors(): boolean {
    return this._nodes.some((node: Node) => node.receptors.length > 0);
  }

  /**
   * Check if the network has some spatial nodes
   */
  get hasSomeSpatialNodes(): boolean {
    return this._nodes.some((node: Node) => node.spatial.hasPositions);
  }

  get isNodeSourceSelected(): boolean {
    const selectedNode = this._state.selectedNode;
    return selectedNode ? !selectedNode.model.isWeightRecorder : false;
  }

  get isWeightRecorderSelected(): boolean {
    const selectedNode = this._state.selectedNode;
    return selectedNode ? selectedNode.model.isWeightRecorder : false;
  }

  get network(): Network {
    return this._network;
  }

  /**
   * Get neurons
   */
  get neurons(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isNeuron);
  }

  get nodesLength(): number {
    return this._state.nodesLength;
  }

  /**
   * Get recorders
   */
  get recorders(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isRecorder);
  }

  /**
   * Get recorders for analog signals
   */
  get recordersAnalog(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isAnalogRecorder);
  }

  /**
   * Get recorders
   */
  get recordersSpike(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isSpikeRecorder);
  }

  set selectedNode(node: Node | null) {
    this._state.selectedNode = this._state.selectedNode !== node ? node : null;
  }

  /**
   * Get spatial nodes
   */
  get spatialNodes(): Node[] {
    return this._nodes.filter((node: Node) => node.spatial.hasPositions);
  }

  get some() {
    return this._nodes.some;
  }

  get state(): UnwrapRef<NodesState> {
    return this._state;
  }

  /**
   * Get stimulators
   */
  get stimulators(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isStimulator);
  }

  /**
   * Get user dict from node annotations.
   */
  get userDict(): { [key: string]: string[] } {
    const userDict: { [key: string]: string[] } = {};
    this._nodes
      .filter((node: Node) => node.annotations.length > 0)
      .forEach((node: Node) => {
        const nodeLabel = node.view.label;
        node.annotations.forEach((annotation: string) => {
          if (annotation in userDict) {
            userDict[annotation].push(nodeLabel);
          } else {
            userDict[annotation] = [nodeLabel];
          }
        });
      });
    return userDict;
  }

  /**
   * Get visible nodes.
   */
  get visibleNodes(): Node[] {
    return this._nodes.filter((node: Node) => node.view.state.visible);
  }

  /**
   * Get nodes with weight recorders.
   */
  get weightRecorders(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isWeightRecorder);
  }

  /**
   * Add node component.
   *
   * @param data node props
   */
  add(data: NodeProps): Node {
    this._logger.trace("add node:", data.model);
    const node = new Node(this, data);
    this._nodes.push(node);
    return node;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._nodes.forEach((node: Node) => node.clean());
  }

  /**
   * Clean weight recorder components.
   */
  cleanWeightRecorders(): void {
    this.weightRecorders.forEach((node: Node) => node.clean());
  }

  /**
   * Clear node list.
   */
  clear(): void {
    this.resetState();
    this._nodes = [];
  }

  /**
   * Filter nodes by model ID.
   * @param modelId string
   * @returns Array of Node
   */
  filterByModelId(modelId: string): Node[] {
    return this._nodes.filter((node: Node) => node.modelId === modelId);
  }

  /**
   * Initialize nodes.
   */
  init(nodes?: NodeProps[]): void {
    this.clear();

    if (nodes) {
      this.update(nodes);
    }
  }

  /**
   * Remove node component from the network.
   *
   */
  remove(node: Node): void {
    this._logger.trace("remove node:", node.modelId);
    this.resetState();

    // Remove node from the node list.
    this._nodes.splice(node.idx, 1);
  }

  /*
   * Reset all states.
   */
  resetState(): void {
    this._state.hash = "";
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(): NodeProps[] {
    return this._nodes.map((node: Node) => node.toJSON());
  }

  unfocusNode(): void {
    this._state.focusedNode = null;
  }

  unselectNode(): void {
    this._state.selectedNode = null;
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  update(nodes?: NodeProps[]): void {
    this._logger.trace("update nodes");
    if (nodes) {
      nodes.forEach((data: NodeProps) => this.add(data));
    }
    this.clean();
  }

  /**
   * Update annotations.
   */
  updateAnnotations(): void {
    this._state.annotations = [];

    const nodeAnnotationsDict: { [key: string]: string[] } = {};
    this._nodes
      .filter((node: Node) => node.annotations.length > 0)
      .forEach((node: Node) => {
        const nodeLabel = node.view.label;
        node.annotations.forEach((annotation: string) => {
          if (annotation in nodeAnnotationsDict) {
            nodeAnnotationsDict[annotation].push(nodeLabel);
          } else {
            nodeAnnotationsDict[annotation] = [nodeLabel];
          }
        });
      });

    if (nodeAnnotationsDict) {
      Object.keys(nodeAnnotationsDict).forEach((userDictKey: string) => {
        const nodes = nodeAnnotationsDict[userDictKey];
        const nodesStr =
          nodes.length === 1 ? nodes[0] : "(" + nodes.join("+") + ")";
        this._state.annotations.push({
          key: userDictKey,
          value: nodesStr,
        });
      });
    }
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = sha1({
      nodes: this._nodes.map((node: Node) => node.state.hash),
    }).slice(0,6);
    this._logger.settings.name = `[${this._network.project.shortId}] nodes #${this._state.hash}`;
  }

  updateNodesLength(): void {
    this._state.nodesLength = this._nodes.length;
  }

  /**
   * Update records of recorders.
   *
   * @remarks
   * It should be called after network created.
   */
  updateRecords(): void {
    this._logger.trace("update records");
    this.recorders
      .filter((recorder: Node) => recorder.model.isAnalogRecorder)
      .forEach((recorder: Node) => recorder.updateRecords());
  }

  /**
   * Update records color of recorders.
   *
   * @remarks
   * It updates colors in activity chart graph.
   */
  updateRecordsColor(): void {
    this.recorders.forEach((recorder: Node) => {
      recorder.updateRecordsColor();
    });

    if (this._network.project.activityGraph.activityChartGraph) {
      this._network.project.activityGraph.activityChartGraph.updateRecordsColor();
    }
  }

  /**
   * Update states.
   */
  updateStates(): void {
    this._nodes.forEach((node: Node) => node.state.update());

    this.updateAnnotations();
    this.updateNodesLength();

    this.updateHash();
  }
}
