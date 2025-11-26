// nodes.ts

import { type UnwrapRef, reactive } from "vue";

import type { AbstractCodeNode } from "@babsey/code-graph";

import type { Class, TActivityGraph, TNetwork, TNode, TNodeGroup } from "@/types";
import { BaseObj, type IBaseState } from "@/helpers/common";

import { BaseNode, type INodeState } from "./node";
import { type INodeGroupState, NodeGroup } from "./nodeGroup";

interface INodesRefState {
  annotations: Record<string, string>[];
  contextMenu: boolean;
  focusedNode: TNode | TNodeGroup | null;
  selectedNodes: (TNode | TNodeGroup)[];
}

export class BaseNodes extends BaseObj {
  private _state: UnwrapRef<INodesRefState> = reactive<INodesRefState>({
    annotations: [],
    contextMenu: false,
    focusedNode: null,
    selectedNodes: [] as (TNode | TNodeGroup)[],
  }); //reactive state
  // public _nodes: (TNode | TNodeGroup)[] = [];
  public _network: TNetwork; // parent

  constructor(network: TNetwork) {
    super();

    this._network = network;
  }

  get Node(): Class<BaseNode> {
    return BaseNode;
  }

  get all(): (TNodeGroup | BaseNode)[] {
    return this.nodes;
  }

  get annotations(): Record<string, string>[] {
    return this.state.annotations;
  }

  get codeNodes(): AbstractCodeNode[] {
    return [];
  }

  /**
   * Check if it has any selected nodes (n > 1).
   */
  get hasAnySelectedNodes(): boolean {
    return this.state.selectedNodes.length > 1;
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

  override get hashObject(): IBaseState {
    return {
      nodes: this.nodeItems.map((node: TNode) => node.hash),
    };
  }

  /**
   * Get length of nodes list.
   */
  get length(): number {
    return this.nodes.length;
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
    return this.nodes.filter((node: TNode | TNodeGroup) => node.isGroup) as TNodeGroup[];
  }

  get nodeItems(): TNode[] {
    return this.nodes.filter((node: TNode | TNodeGroup) => node.isNode) as TNode[];
  }

  get nodes(): (TNode | TNodeGroup)[] {
    return this.codeNodes.map((codeNode: AbstractCodeNode) => codeNode.mask);
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
    const selectedNodes = this.state.selectedNodes as (TNode | TNodeGroup)[];
    return selectedNodes.filter((node: TNode | TNodeGroup) => node.isGroup) as TNodeGroup[];
  }

  /**
   * Get selected nodes.
   */
  get selectedNodeItems(): TNode[] {
    const selectedNodes = this.state.selectedNodes as (TNode | TNodeGroup)[];
    return selectedNodes.filter((node: TNode | TNodeGroup) => node.isNode) as TNode[];
  }

  get state(): UnwrapRef<INodesRefState> {
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
   */
  addNode(nodeState?: INodeState): TNode {
    this.logger.trace("add node");

    const node = new this.Node(this);
    if (nodeState) node.load(nodeState);
    return node;
  }

  /**
   * Add node group component.
   * @param nodeGroupState node group state
   */
  addNodeGroup(nodeGroupState: INodeGroupState): TNodeGroup {
    this.logger.trace("add node group");

    const nodeGroup = new NodeGroup(this, nodeGroupState);
    // this._nodes.push(nodeGroup);

    nodeGroup.updateHash();
    return nodeGroup;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this.nodes.forEach((node: TNode | TNodeGroup) => node.clean());
  }

  /**
   * Remove node groups containing less than two items.
   */
  cleanNodeGroups(): void {
    this.nodeGroups.forEach((nodeGroup: TNodeGroup) => {
      if (nodeGroup.nodes.length < 2) {
        nodeGroup.remove();
      } else {
        nodeGroup.update();
      }
    });
  }

  /**
   * Clear node list.
   */
  clear(): void {
    this.resetState();
    // this._nodes = [];
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
    this.network.changes({ preventSimulation: true });
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
   * Load nodes from state.
   * @param nodeStates node states
   */
  load(nodeStates?: INodeState[]): void {
    this.logger.trace("update");

    if (nodeStates)
      nodeStates.forEach((nodeState: INodeState | INodeGroupState) => {
        if ("nodes" in nodeState) {
          this.addNodeGroup(nodeState as INodeGroupState);
        } else {
          this.addNode(nodeState as INodeState);
        }
      });

    this.clean();
    this.updateHash();
  }

  /**
   * Register code node.
   */
  registerCodeNode(codeNode: AbstractCodeNode, node?: TNode): void {
    this.logger.trace("register code node:", codeNode.shortId);

    if (!node) node = this.addNode({ model: codeNode.inputs.model.value });

    node.registerCodeNode(codeNode);
    node.init();
  }

  /**
   * Register code nodes.
   * @param type code node type
   */
  registerCodeNodes(type: string): void {
    this.logger.trace("register code nodes: ", type);

    const graph = this.network.project.viewModel?.editor.graph;
    if (!graph) return;

    const codeNodes = graph.getNodesByType(type);
    codeNodes.forEach((codeNode: AbstractCodeNode) => this.registerCodeNode(codeNode));
  }

  /**
   * Remove node component from the network.
   * @param node node instance
   */
  remove(node: TNode | TNodeGroup): void {
    this.logger.trace("remove node");

    this.network.state.unselectAll();

    node.codeNode?.remove();

    // Remove node from the node list.
    // this._nodes.splice(node.idx, 1);
  }

  /**
   * Remove node in the node groups.
   * @param node node instance
   */
  removeNodeInNodeGroups(node: TNode | TNodeGroup): void {
    this.resetState();

    this.nodeGroups.forEach((nodeGroup: TNodeGroup) => nodeGroup.removeNode(node));
  }

  /*
   * Reset all states.
   */
  resetState(): void {}

  /**
   * Save nodes to state.
   * @return node states
   */
  override save(): (INodeState | INodeGroupState)[] {
    return this.nodes.map((node: TNode | TNodeGroup) => node.save());
  }

  /**
   * Select node.
   * @param node node or node group instance
   */
  selectNode(node: TNode | TNodeGroup) {
    this.state.selectedNodes.push(node);
    this.state.selectedNodes.sort();
  }

  /**
   * Show node in list.
   */
  showNode(node: TNode | TNodeGroup): boolean {
    const elementTypeIdx = this.network.state.elementTypeIdx;

    if (this.state.selectedNodes.length > 0) {
      // selected node
      return (
        this.selectedNodeGroups.some((nodeGrp: TNodeGroup) => nodeGrp.nodes.includes(node)) ||
        this.state.selectedNodes.includes(node)
      );
    } else if (elementTypeIdx > 0) {
      // element type
      return this.network.elementTypes[elementTypeIdx].id === node.elementType;
    } else if (this.network.state.state.displayIdx.nodes.length > 0) {
      // custom
      return this.network.state.state.displayIdx.nodes.includes(node.idx);
    } else {
      // all
      return true;
    }
  }

  /**
   * Toggle node selection
   * @param node node or node group instance
   */
  toggleNodeSelection(node: TNode | TNodeGroup) {
    this.network.state.state.elementTypeIdx = 0;

    if (this.state.selectedNodes.includes(node)) {
      this.unselectNode(node);
    } else {
      this.selectNode(node);
    }
  }

  /**
   * Unfocus node.
   */
  unfocusNode(): void {
    this.state.focusedNode = null;
  }

  /**
   * Unselect node.
   * @param node node or node group instance
   */
  unselectNode(node: TNode | TNodeGroup) {
    const index = this.state.selectedNodes.indexOf(node);
    this.state.selectedNodes.splice(index, 1);
  }

  /**
   * Unselect node.
   */
  unselectNodes(): void {
    this.state.selectedNodes = [];
  }

  /**
   * Update annotations.
   */
  updateAnnotations(): void {
    this.state.annotations = [];

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
        this.state.annotations.push({
          key: userDictKey,
          value: nodesStr,
        });
      });
    }
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
