// nodes.ts

import { UnwrapRef, reactive } from "vue";

import { TActivityGraph, TNetwork, TNode, TNodeGroup } from "@/types";

import { BaseNode, INodeProps } from "./node";
import { BaseObj } from "../common/base";
import { INodeGroupProps, NodeGroup } from "./nodeGroup";

interface INodesState {
  annotations: Record<string, string>[];
  contextMenu: boolean;
  focusedNode: TNodeGroup | TNode | null;
  selectedNodes: (TNodeGroup | TNode)[];
}

export class BaseNodes extends BaseObj {
  private _state: UnwrapRef<INodesState>; //reactive state
  public _nodes: (TNodeGroup | TNode)[] = [];
  public _network: TNetwork; // parent

  constructor(network: TNetwork, nodesProps?: (INodeProps | INodeGroupProps)[]) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._network = network;

    this._state = reactive<INodesState>({
      annotations: [],
      contextMenu: false,
      focusedNode: null,
      selectedNodes: [] as (TNodeGroup | TNode)[],
    });

    this.update(nodesProps);
  }

  get Node() {
    return BaseNode;
  }

  get all(): (TNodeGroup | BaseNode)[] {
    return this._nodes;
  }

  get annotations(): Record<string, string>[] {
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
    return this.nodeItems.some((node: TNode) => node.model?.isAnalogRecorder);
  }

  /**
   * Check if it contains some spike recorders.
   */
  get hasSomeSpikeRecorder(): boolean {
    return this.nodeItems.some((node: TNode) => node.model?.isSpikeRecorder);
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
    return this.nodeItems.filter((node: TNode) => node.model.isNeuron);
  }

  get nodeGroups(): TNodeGroup[] {
    return this._nodes.filter((node: TNodeGroup | TNode) => node.isGroup) as TNodeGroup[];
  }

  get nodeItems(): TNode[] {
    return this._nodes.filter((node: TNodeGroup | TNode) => node.isNode) as TNode[];
  }

  get nodes(): (TNodeGroup | TNode)[] {
    return this._nodes;
  }

  /**
   * Get recorders.
   */
  get recorders(): TNode[] {
    return this.nodeItems.filter((node: TNode) => node.model?.isRecorder);
  }

  /**
   * Get recorders for analog signals.
   */
  get recordersAnalog(): TNode[] {
    return this.nodeItems.filter((node: TNode) => node.model?.isAnalogRecorder);
  }

  /**
   * Get spike recorders.
   */
  get recordersSpike(): TNode[] {
    return this.nodeItems.filter((node: TNode) => node.model?.isSpikeRecorder);
  }

  /**
   * Get selected node groups.
   */
  get selectedNodeGroups(): TNodeGroup[] {
    const selectedNodes = this._state.selectedNodes as (TNodeGroup | TNode)[];
    return selectedNodes.filter((node: TNodeGroup | TNode) => node.isGroup) as TNodeGroup[];
  }

  /**
   * Get selected nodes.
   */
  get selectedNodeItems(): TNode[] {
    const selectedNodes = this._state.selectedNodes as (TNodeGroup | TNode)[];
    return selectedNodes.filter((node: TNodeGroup | TNode) => node.isNode) as TNode[];
  }

  get state(): UnwrapRef<INodesState> {
    return this._state;
  }

  /**
   * Get stimulators.
   */
  get stimulators(): TNode[] {
    return this.nodeItems.filter((node: TNode) => node.model.isStimulator);
  }

  /**
   * Get user dict from node annotations.
   */
  get userDict(): Record<string, string[]> {
    const userDict: Record<string, string[]> = {};
    this.nodeItems
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

  // /**
  //  * Get visible nodes.
  //  */
  // get visibleNodes(): TNode[] {
  //   return this.nodeItems.filter((node: TNode) => node.view.state.visible);
  // }

  /**
   * Add node component.
   * @param nodeProps node props
   */
  addNode(nodeProps: INodeProps): TNode {
    this.logger.trace("add node:", nodeProps.model);

    const node = new this.Node(this, nodeProps);
    this._nodes.push(node);

    node.updateHash();
    return node;
  }

  /**
   * Add node group component.
   * @param nodeGroupProps node group props
   */
  addNodeGroup(nodeGroupProps: INodeGroupProps): TNodeGroup {
    this.logger.trace("add node group");

    const nodeGroup = new NodeGroup(this, nodeGroupProps);
    this._nodes.push(nodeGroup);

    nodeGroup.updateHash();
    return nodeGroup;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.nodes.forEach((node: TNodeGroup | TNode) => node.clean());
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
    return this.nodeItems.filter((node: TNode) => node.modelId === modelId);
  }

  /**
   * Group selected nodes.
   */
  groupSelected(): void {
    const nodes = this._state.selectedNodes.map((node) => node.idx);
    const nodeGroup = this.addNodeGroup({ nodes });
    this.selectNode(nodeGroup);
    this._network.changes({ preventSimulation: true });
  }

  /**
   * Initialize nodes.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.nodeItems.forEach((node: TNode) => node.init());
    this.updateRecords();
  }

  /**
   * Remove node component from the network.
   * @param node node object
   */
  remove(node: TNodeGroup | TNode): void {
    this.logger.trace("remove node");

    this._network.state.unselectAll();

    // Remove node from the node list.
    this._nodes.splice(node.idx, 1);
  }

  /**
   * Remove node in the node groups.
   * @param node node object
   */
  removeInNodeGroups(node: TNodeGroup | TNode): void {
    this.resetState();

    this.nodeGroups.forEach((nodeGroup: TNodeGroup) => nodeGroup.removeNode(node));
  }

  /*
   * Reset all states.
   */
  resetState(): void {}

  /**
   * Select node.
   * @param node node or node group object
   */
  selectNode(node: TNodeGroup | TNode) {
    this._state.selectedNodes.push(node);
    this._state.selectedNodes.sort();
  }

  /**
   * Show node in list.
   */
  showNode(node: TNodeGroup | TNode): boolean {
    const elementTypeIdx = this._network.state.elementTypeIdx;

    if (this._state.selectedNodes.length > 0) {
      // selected node
      return (
        this.selectedNodeGroups.some((nodeGrp: TNodeGroup) => nodeGrp.nodes.includes(node)) ||
        this._state.selectedNodes.includes(node)
      );
    } else if (elementTypeIdx > 0) {
      // element type
      return this._network.elementTypes[elementTypeIdx].id === node.elementType;
    } else if (this._network.state.state.displayIdx.nodes.length > 0) {
      // custom
      return this._network.state.state.displayIdx.nodes.includes(node.idx);
    } else {
      // all
      return true;
    }
  }

  /**
   * Serialize for JSON.
   * @return list of node props
   */
  toJSON(): (INodeGroupProps | INodeProps)[] {
    return this.nodes.map((node: TNodeGroup | TNode) => node.toJSON());
  }

  /**
   * Toggle node selection
   * @param node node or node group object
   */
  toggleNodeSelection(node: TNodeGroup | TNode) {
    this._network.state.state.elementTypeIdx = 0;

    if (this._state.selectedNodes.includes(node)) {
      this.unselectNode(node);
    } else {
      this.selectNode(node);
    }
  }

  /**
   * Unfocus node.
   */
  unfocusNode(): void {
    this._state.focusedNode = null;
  }

  /**
   * Unselect node.
   * @param node node or node group object
   */
  unselectNode(node: TNodeGroup | TNode) {
    const index = this._state.selectedNodes.indexOf(node);
    this._state.selectedNodes.splice(index, 1);
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
  update(nodesProps?: (INodeProps | INodeGroupProps)[]): void {
    this.logger.trace("update");

    if (nodesProps)
      nodesProps.forEach((nodeProps: INodeProps | INodeGroupProps) => {
        if ("nodes" in nodeProps) {
          this.addNodeGroup(nodeProps as INodeGroupProps);
        } else {
          this.addNode(nodeProps as INodeProps);
        }
      });

    this.clean();
    this.updateHash();
  }

  /**
   * Update annotations.
   */
  updateAnnotations(): void {
    this._state.annotations = [];

    const nodeAnnotationsDict: Record<string, string[]> = {};
    this.nodeItems
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
        const nodesStr = nodes.length === 1 ? nodes[0] : "(" + nodes.join("+") + ")";
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
      nodes: this.nodeItems.map((node: TNode) => node.hash),
    });
  }

  /**
   * Update records of recorders.
   * @remarks It should be called after network created.
   */
  updateRecords(): void {
    this.logger.trace("update records");

    this.recordersAnalog.forEach((recorder: TNode) => recorder.updateRecords());
  }

  /**
   * Update records color of recorders.
   * @remarks It updates colors in activity chart graph.
   */
  updateRecordsColor(): void {
    this.logger.trace("update records color");

    this.recordersAnalog.forEach((recorder: TNode) => recorder.updateRecordsColor());

    const activityGraph = this.network.project.activityGraph as TActivityGraph;
    if (activityGraph.activityChartGraph) activityGraph.activityChartGraph.updateRecordsColor();
  }

  /**
   * Update states.
   */
  updateStates(): void {
    this.updateAnnotations();
    this.updateHash();
  }
}
