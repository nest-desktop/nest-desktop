// nodes.ts

import { reactive, UnwrapRef } from "vue";

import { BaseNode, INodeProps } from "./node";
import { BaseObj } from "../common/base";
import { NodeGroup } from "./nodeGroup";
import { TActivityGraph } from "@/types/activityGraphTypes";
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
  selectedNodes: TNode[];
}

export class BaseNodes extends BaseObj {
  private _state: UnwrapRef<INodesState>; //reactive state
  public _items: (TNode | NodeGroup)[] = [];
  public _network: TNetwork; // parent

  constructor(network: TNetwork, nodesProps?: INodeProps[]) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._network = network;

    this._state = reactive({
      annotations: [],
      contextMenu: false,
      elementTypeIdx: 0,
      focusedNode: null,
      selectedNodes: [] as TNode[],
    });

    this.update(nodesProps);
  }

  get Node() {
    return BaseNode;
  }

  get all(): (TNode | NodeGroup)[] {
    return this._items;
  }

  get annotations(): { [key: string]: string }[] {
    return this._state.annotations;
  }

  /**
   * Check if it has any selected nodes (n > 1).
   */
  get hasAnySelectedNodes(): boolean {
    return this._state.selectedNodes.length > 1;
  }

  /**
   * Check if it contains some recorders for analog signals.
   */
  get hasSomeAnalogRecorder(): boolean {
    return this.nodes.some((node: TNode) => node.model.isAnalogRecorder);
  }

  /**
   * Check if it contains some spike recorders.
   */
  get hasSomeSpikeRecorder(): boolean {
    return this.nodes.some((node: TNode) => node.model.isSpikeRecorder);
  }

  /**
   * Get length of nodes list.
   */
  get length(): number {
    return this._items.length;
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
    return this._items.filter(
      (node: TNode | NodeGroup) => !node.isGroup
    ) as TNode[];
  }

  get nodeGroups(): NodeGroup[] {
    return this._items.filter(
      (node: TNode | NodeGroup) => node.isGroup
    ) as NodeGroup[];
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
   * @param nodeProps node props
   */
  addNode(nodeProps: INodeProps): TNode {
    this.logger.trace("add node:", nodeProps.model);
    const node = new this.Node(this, nodeProps);
    this._items.push(node);
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
    this._items = [];
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
   * Group selected nodes.
   */
  groupSelected(): void {
    const nodeGroup = new NodeGroup(this, this._state.selectedNodes as TNode[]);
    this._items.push(nodeGroup);
    this.unselectNodes();
    this._network.changes();
  }

  /**
   * Initialize nodes.
   */
  init(): void {
    this.logger.trace("init");
    this.nodes.forEach((node: TNode) => node.init());
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
    this._items.splice(node.idx, 1);
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
    } else if (this._state.selectedNodes.length > 0) {
      // selected view
      return this._state.selectedNodes.includes(node);
      // } else if (this._state.selectedNode) {
      //   // selected view
      //   return this._state.selectedNode === node;
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
   * @return network props
   */
  toJSON(): INodeProps[] {
    return this.nodes.map((node: TNode) => node.toJSON());
  }

  /**
   * Toggle node selection
   * @param node node object
   */
  toggleNodeSelection(node: TNode) {
    var index = this._state.selectedNodes.indexOf(node);
    if (index === -1) {
      this._state.selectedNodes.push(node);
      this._state.selectedNodes.sort();
    } else {
      this._state.selectedNodes.splice(index, 1);
    }
    this.state.selectedNodes.sort();
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
  unselectNodes(): void {
    this._state.selectedNodes = [];
  }

  /**
   * Update network component.
   *
   * @param networkProps network props
   */
  update(nodesProps?: INodeProps[]): void {
    this.logger.trace("update");

    if (nodesProps) {
      nodesProps.forEach((nodeProps: INodeProps) => this.addNode(nodeProps));
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

    const activityGraph = this.network.project.activityGraph as TActivityGraph;

    if (activityGraph.activityChartGraph) {
      activityGraph.activityChartGraph.updateRecordsColor();
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
