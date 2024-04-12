// nodes.ts

import { reactive, UnwrapRef } from "vue";

import { BaseNode, INodeProps } from "./node";
import { BaseObj } from "../common/base";
import { TNetwork } from "@/types/networkTypes";
import { TNode } from "@/types/nodeTypes";

const _nodeTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi:mdi-all-inclusive", id: "all", title: "all" },
  { icon: "network:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "network:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "network:recorder", id: "recorder", title: "recorder" },
];

interface INodesState {
  annotations: { [key: string]: string }[];
  contextMenu: boolean;
  elementTypeIdx: number;
  focusedNode: TNode | null;
  selectedNode: TNode | null;
}

export class BaseNodes extends BaseObj {
  private _state: UnwrapRef<INodesState>; //reactive state
  public _network: TNetwork; // parent
  public _nodes: TNode[] = [];

  constructor(network: TNetwork, nodesProps?: INodeProps[]) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._network = network;

    this._state = reactive({
      annotations: [],
      contextMenu: false,
      elementTypeIdx: 0,
      focusedNode: null,
      selectedNode: null,
    });

    this.update(nodesProps);
  }

  get Node() {
    return BaseNode;
  }

  get all(): TNode[] {
    return this._nodes;
  }

  get annotations(): { [key: string]: string }[] {
    return this._state.annotations;
  }

  /**
   * Some recorders for analog signals
   */
  get hasSomeAnalogRecorder(): boolean {
    return this.nodes.some((node: TNode) => node.model.isAnalogRecorder);
  }

  /**
   * Some spike recorders
   */
  get hasSomeSpikeRecorder(): boolean {
    return this.nodes.some((node: TNode) => node.model.isSpikeRecorder);
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

  get network(): TNetwork {
    return this._network;
  }

  /**
   * Get neurons
   */
  get neurons(): TNode[] {
    return this.nodes.filter((node: TNode) => node.model.isNeuron);
  }

  get nodes(): TNode[] {
    return this._nodes;
  }

  get nodeTypes(): { icon: string; id: string; title: string }[] {
    return _nodeTypes;
  }

  /**
   * Get recorders
   */
  get recorders(): TNode[] {
    return this.nodes.filter((node: TNode) => node.model.isRecorder);
  }

  /**
   * Get recorders for analog signals
   */
  get recordersAnalog(): TNode[] {
    return this.nodes.filter((node: TNode) => node.model.isAnalogRecorder);
  }

  /**
   * Get recorders
   */
  get recordersSpike(): TNode[] {
    return this.nodes.filter((node: TNode) => node.model.isSpikeRecorder);
  }

  // set selectedNode(node: TNode | null) {
  //   this._state.selectedNode = this._state.selectedNode !== node ? node : null;
  // }

  // get some() {
  //   return this._nodes.some;
  // }

  get state(): UnwrapRef<INodesState> {
    return this._state;
  }

  /**
   * Get stimulators.
   */
  get stimulators(): TNode[] {
    return this.nodes.filter((node: TNode) => node.model.isStimulator);
  }

  /**
   * Get user dict from node annotations.
   */
  get userDict(): { [key: string]: string[] } {
    const userDict: { [key: string]: string[] } = {};
    this.nodes
      .filter((node: TNode) => node.annotations.length > 0)
      .forEach((node: TNode) => {
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
  get visibleNodes(): TNode[] {
    return this.nodes.filter((node: TNode) => node.view.state.visible);
  }

  /**
   * Add node component.
   *
   * @param nodeProps node props
   */
  add(nodeProps: INodeProps): TNode {
    this.logger.trace("add node:", nodeProps.model);
    const node = new this.Node(this, nodeProps);
    this._nodes.push(node);
    return node;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.nodes.forEach((node: TNode) => node.clean());
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
  filterByModelId(modelId: string): TNode[] {
    return this.nodes.filter((node: TNode) => node.modelId === modelId);
  }

  /**
   * Initialize nodes.
   */
  init(): void {
    this.logger.trace("init");
    this._nodes.forEach((node: TNode) => node.init());
    this.updateRecords();
  }

  /**
   * Remove node component from the network.
   *
   */
  remove(node: TNode): void {
    this.logger.trace("remove node:", node.modelId);
    this.resetState();

    // Remove node from the node list.
    this._nodes.splice(node.idx, 1);
  }

  /*
   * Reset all states.
   */
  resetState(): void {}

  /**
   * Show node in list.
   */
  showNode(node: TNode): boolean {
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
  toJSON(): INodeProps[] {
    return this.nodes.map((node: TNode) => node.toJSON());
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
   * @param networkProps network props
   */
  update(nodesProps?: INodeProps[]): void {
    this.logger.trace("update");

    if (nodesProps) {
      nodesProps.forEach((nodeProps: INodeProps) => this.add(nodeProps));
    }

    this.clean();
    this.updateHash();
  }

  /**
   * Update annotations.
   */
  updateAnnotations(): void {
    this._state.annotations = [];

    const nodeAnnotationsDict: { [key: string]: string[] } = {};
    this.nodes
      .filter((node: TNode) => node.annotations.length > 0)
      .forEach((node: TNode) => {
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
    this._updateHash({
      nodes: this.nodes.map((node: TNode) => node.hash),
    });
  }

  /**
   * Update records of recorders.
   *
   * @remarks
   * It should be called after network created.
   */
  updateRecords(): void {
    this.logger.trace("update records");
    this.recorders
      .filter((recorder: TNode) => recorder.model.isAnalogRecorder)
      .forEach((recorder: TNode) => recorder.updateRecords());
  }

  /**
   * Update records color of recorders.
   *
   * @remarks
   * It updates colors in activity chart graph.
   */
  updateRecordsColor(): void {
    this.logger.trace("update records color");
    this.recorders.forEach((recorder: TNode) => {
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
    this.updateAnnotations();
    this.updateHash();
  }
}
