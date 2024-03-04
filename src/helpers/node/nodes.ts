// nodes.ts

import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { BaseNode, NodeProps } from "@/helpers/node/node";
import { Network } from "@/types/networkTypes";
import { Node } from "@/types/nodeTypes";
import { logger as mainLogger } from "@/helpers/common/logger";

const _nodeTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi-all-inclusive", id: "all", title: "all" },
  { icon: "network:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "network:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "network:recorder", id: "recorder", title: "recorder" },
];

interface NodesState {
  annotations: { [key: string]: string }[];
  elementTypeIdx: number;
  focusedNode: Node | null;
  hash: string;
  selectedNode: Node | null;
}

export class BaseNodes {
  private _logger: Logger<ILogObj>;
  private _state: UnwrapRef<NodesState>; //reactive state

  public _network: Network; // parent
  public _nodes: Node[] = [];

  constructor(network: Network, nodes?: NodeProps[]) {
    this._network = network;

    this._logger = mainLogger.getSubLogger({
      name: `[${this.network.project.shortId}] nodes`,
      minLevel: 3,
    });

    this._state = reactive({
      annotations: [],
      elementTypeIdx: 0,
      focusedNode: null,
      hash: "",
      selectedNode: null,
    });

    this.init(nodes);
  }

  get all(): Node[] {
    return this._nodes;
  }

  get annotations(): any {
    return this._state.annotations;
  }

  /**
   * Some recorders for analog signals
   */
  get hasSomeAnalogRecorder(): boolean {
    return this.nodes.some((node: Node) => node.model.isAnalogRecorder);
  }

  /**
   * Some spike recorders
   */
  get hasSomeSpikeRecorder(): boolean {
    return this.nodes.some((node: Node) => node.model.isSpikeRecorder);
  }

  get isAnyNodeSelected(): boolean {
    return this._state.selectedNode != null;
  }

  /**
   * Get length of nodes list.
   */
  get length(): number {
    return this._nodes.length;
  }

  get network(): Network {
    return this._network;
  }

  /**
   * Get neurons
   */
  get neurons(): Node[] {
    return this.nodes.filter((node: Node) => node.model.isNeuron);
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get nodeTypes(): { icon: string; id: string; title: string }[] {
    return _nodeTypes;
  }

  /**
   * Get recorders
   */
  get recorders(): Node[] {
    return this.nodes.filter((node: Node) => node.model.isRecorder);
  }

  /**
   * Get recorders for analog signals
   */
  get recordersAnalog(): Node[] {
    return this.nodes.filter((node: Node) => node.model.isAnalogRecorder);
  }

  /**
   * Get recorders
   */
  get recordersSpike(): Node[] {
    return this.nodes.filter((node: Node) => node.model.isSpikeRecorder);
  }

  // set selectedNode(node: Node | null) {
  //   this._state.selectedNode = this._state.selectedNode !== node ? node : null;
  // }

  // get some() {
  //   return this._nodes.some;
  // }

  get state(): UnwrapRef<NodesState> {
    return this._state;
  }

  /**
   * Get stimulators.
   */
  get stimulators(): Node[] {
    return this.nodes.filter((node: Node) => node.model.isStimulator);
  }

  /**
   * Get user dict from node annotations.
   */
  get userDict(): { [key: string]: string[] } {
    const userDict: { [key: string]: string[] } = {};
    this.nodes
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
    return this.nodes.filter((node: Node) => node.view.state.visible);
  }

  /**
   * Add node component.
   *
   * @param data node props
   */
  add(data: NodeProps): Node {
    this._logger.trace("add node:", data.model);
    const node = this.newNode(data);
    this._nodes.push(node);
    return node;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.nodes.forEach((node: Node) => node.clean());
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
    return this.nodes.filter((node: Node) => node.modelId === modelId);
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
   * Create new node.
   *
   * @param data
   * @returns BaseNode
   */
  newNode(data?: NodeProps): Node {
    return new BaseNode(this, data);
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
   * Show node in list.
   */
  showNode(node: Node): boolean {
    const elementTypeIdx = this._state.elementTypeIdx;

    if (elementTypeIdx === 4) {
      return false;
    } else if (this._state.selectedNode) {
      // selected view
      return node.state.isSelected;
    } else if (elementTypeIdx === 0) {
      // all view
      return true;
    } else if (elementTypeIdx < _nodeTypes.length) {
      // element type view
      return _nodeTypes[elementTypeIdx].id === node.model.elementType;
    } else {
      // custom view
      return this._network.state.state.displayIdx.nodes.includes(node.idx);
    }
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(): NodeProps[] {
    return this.nodes.map((node: Node) => node.toJSON());
  }

  /**
   * Unfocus node.
   */
  unfocusNode(): void {
    this._state.focusedNode = null;
  }

  /**
   * Unselect node.
   */
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
    this.nodes
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
      nodes: this.nodes.map((node: Node) => node.state.hash),
    }).slice(0, 6);
    this._logger.settings.name = `[${this.network.project.shortId}] nodes #${this._state.hash}`;
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
    this._logger.trace("update records color");
    this.recorders.forEach((recorder: Node) => {
      recorder.updateRecordsColor();
    });

    if (this.network.project.activityGraph.activityChartGraph) {
      this.network.project.activityGraph.activityChartGraph.updateRecordsColor();
    }
  }

  /**
   * Update states.
   */
  updateStates(): void {
    this.nodes.forEach((node: Node) => node.state.update());

    this.updateAnnotations();
    this.updateHash();
  }
}
