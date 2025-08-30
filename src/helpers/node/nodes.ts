// nodes.ts

import { UnwrapRef, reactive } from "vue";

import { TActivityGraph, TNetwork, TNode, TNodeGroup } from "@/types";

import { BaseNode, INodeProps } from "./node";
import { BaseObj } from "../common/base";
import { INodeGroupProps, NodeGroup } from "./nodeGroup";
import { AbstractCodeNode } from "../codeGraph/codeNode";
import { INodeViewProps } from "./nodeViewState";

interface INodesState {
  annotations: Record<string, string>[];
  contextMenu: boolean;
  focusedNode: TNode | TNodeGroup | null;
  selectedNodes: (TNode | TNodeGroup)[];
}

export class BaseNodes extends BaseObj {
  private _state: UnwrapRef<INodesState>; //reactive state
  // public _nodes: (TNode | TNodeGroup)[] = [];
  public _network: TNetwork; // parent

  constructor(network: TNetwork, nodesProps?: (INodeProps | INodeGroupProps)[]) {
    super();
    // this.logger.settings.minLevel = 1;

    this._network = network;

    this._state = reactive<INodesState>({
      annotations: [],
      contextMenu: false,
      focusedNode: null,
      selectedNodes: [] as (TNode | TNodeGroup)[],
    });

    this.update(nodesProps);
  }

  get Node() {
    return BaseNode;
  }

  get allNodes(): (TNodeGroup | BaseNode)[] {
    return this.nodes;
  }

  get annotations(): Record<string, string>[] {
    return this._state.annotations;
  }

  override get codeNodes(): AbstractCodeNode[] {
    return this.network.project.code.graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create");
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
    return this.allNodes.filter((node: TNode | TNodeGroup) => node.isGroup) as TNodeGroup[];
  }

  get nodeItems(): TNode[] {
    return this.allNodes.filter((node: TNode | TNodeGroup) => node.isNode) as TNode[];
  }

  get nodeUuids(): string {
    return this.allNodes.map((node) => node.uuid);
  }

  get nodes(): (TNode | TNodeGroup)[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => node.view).map((node) => node.view) as (
      | TNode
      | TNodeGroup
    )[];
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
    const selectedNodes = this._state.selectedNodes as (TNode | TNodeGroup)[];
    return selectedNodes.filter((node: TNode | TNodeGroup) => node.isGroup) as TNodeGroup[];
  }

  /**
   * Get selected nodes.
   */
  get selectedNodeItems(): TNode[] {
    const selectedNodes = this._state.selectedNodes as (TNode | TNodeGroup)[];
    return selectedNodes.filter((node: TNode | TNodeGroup) => node.isNode) as TNode[];
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
        const nodeLabel = node.state.label;
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
  //   return this.nodeItems.filter((node: TNode) => node.state.visible);
  // }

  // /**
  //  * Add code nodes.
  //  * @param node node component.
  //  */
  // addCodeNodes(node: TNode | TNodeGroup): void {
  //   node;
  // }

  /**
   * Add node component on user interaction.
   * @param model model name of default models
   * @param view node view props
   */
  addNode(model?: string, view?: INodeViewProps): void {
    this.logger.debug("create node");
  }

  // /**
  //  * Add node group component.
  //  * @param nodeGroupProps node group props
  //  */
  // addNodeGroup(nodeGroupProps: INodeGroupProps): TNodeGroup {
  //   this.logger.trace("add node group");

  //   const nodeGroup = new NodeGroup(this, nodeGroupProps);
  //   this._nodes.push(nodeGroup);

  //   nodeGroup.updateHash();
  //   return nodeGroup;
  // }

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
   * @returns Array of node
   */
  filterByModelId(modelId: string): TNode[] {}

  // /**
  //  * Group selected nodes.
  //  */
  // groupSelected(): void {
  //   const nodes = this._state.selectedNodes.map((node) => node.idx);
  //   const nodeGroup = this.addNodeGroup({ nodes });
  //   this.selectNode(nodeGroup);
  //   this._network.onUpdate({ preventSimulation: true });
  // }

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
  removeNode(node: TNode): void {
    this.logger.trace("remove node");
    if (!node.codeNode || !node.codeNode.graph) return;

    this.network.state.unselectAll();

    const recorders = node.connectedRecorders;

    // Remove connection from the list.
    node.removeConnections();

    // Remove node in node groups
    // this.nodes.removeNodeInNodeGroups(node);

    // Remove node from the list.
    this.network.project.code.graph.removeNode(node.codeNode);

    // Clean node groups.
    // this.nodes.cleanNodeGroups();

    // Update recorder.
    if (recorders.length > 0) recorders.forEach((recorder: TNode) => recorder.updateRecorder());

    // Trigger network change.
    // this.onUpdate({ cleanPanels, preventSimulation: true });
  }

  /**
   * Remove node in the node groups.
   * @param node node object
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
   * Select node.
   * @param node node or node group object
   */
  selectNode(node: TNode | TNodeGroup) {
    this._state.selectedNodes.push(node);
    this._state.selectedNodes.sort();
  }

  /**
   * Show node in list.
   */
  showNode(node: TNode | TNodeGroup): boolean {
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
    return this.nodes.map((node: TNode | TNodeGroup) => node.toJSON());
  }

  /**
   * Toggle node selection
   * @param node node or node group object
   */
  toggleNodeSelection(node: TNode | TNodeGroup) {
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
  unselectNode(node: TNode | TNodeGroup) {
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

    // if (nodesProps)
    //   nodesProps.forEach((nodeProps: INodeProps | INodeGroupProps) => {
    //     if ("nodes" in nodeProps) {
    //       this.addNodeGroup(nodeProps as INodeGroupProps);
    //     } else {
    //       this.addNode(nodeProps as INodeProps);
    //     }
    //   });

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
        const nodeLabel = node.label;
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

  /**
   * Update node style, e.g. node color.
   */
  updateStyle(): void {
    this.logger.trace("update node style");

    this.allNodes.forEach((node: NodeGroup | TNode) => node.state.updateStyle());
  }
}
