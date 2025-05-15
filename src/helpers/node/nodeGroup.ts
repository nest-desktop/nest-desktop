// nodeGroup.ts

import { TConnection, TNetwork, TNode, TNodeGroup, TNodes } from "@/types";

import { BaseObj } from "../common/base";
import { NodeGroupView } from "./nodeGroupView";

export interface INodeGroupProps {
  nodes: number[];
}

export class NodeGroup extends BaseObj {
  private _parent: TNodes;
  private _nodes: (TNode | TNodeGroup)[] = [];
  private _view: NodeGroupView;

  constructor(parent: TNodes, nodeGroupProps: INodeGroupProps) {
    super();
    this._parent = parent;
    nodeGroupProps.nodes.forEach((idx: number) => this.addNode(idx));

    this._view = new NodeGroupView(this);

    this.updateHash();
  }

  get all(): (NodeGroup | TNode)[] {
    return this._nodes;
  }

  get connectedNodes(): TNode[] {
    return [...this.sourceNodes, ...this.targetNodes];
  }

  get connectedRecorders(): TNode[] {
    return this.connectedNodes.filter((node: TNode) => node.model.isRecorder);
  }

  get connections(): TConnection[] {
    return this.network.connections.all.filter((connection: TConnection) => connection.sourceIdx === this.idx);
  }

  get connectionsWithin(): TConnection[] {
    const nodeIndices = this.nodesDeep.map((node) => node.idx);
    nodeIndices.push(this.idx);

    return this.network.connections.all.filter(
      (connection: TConnection) =>
        nodeIndices.includes(connection.sourceIdx) && nodeIndices.includes(connection.targetIdx),
    );
  }

  get elementType(): string {
    return "group";
  }

  get idx(): number {
    return this._parent.all.indexOf(this);
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this._view.synWeights === "excitatory";
  }

  get isGroup(): boolean {
    return true;
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this._view.synWeights === "inhibitory";
  }

  get isNode(): boolean {
    return false;
  }

  get isRecorded(): boolean {
    return this.connectedNodes.some((node: TNode) => node.model.isRecorder);
  }

  /**
   * Check if this node is selected.
   */
  get isSelected(): boolean {
    return this.parentNodes.state.selectedNodes.includes(this);
  }

  /**
   * Check if this node is selected for connection.
   */
  get isSelectedForConnection(): boolean {
    return this.parentNodes.network.connections.state.selectedNode === this;
  }

  get isSpatial(): boolean {
    return false;
  }

  get model(): boolean {
    return false;
  }

  get network(): TNetwork {
    return this._parent.network;
  }

  get nodeGroups(): TNodeGroup[] {
    return this._nodes.filter((node: TNode | TNodeGroup) => node.isGroup) as TNodeGroup[];
  }

  get nodeIndicesDeep(): number[] {
    return [
      ...new Set(
        this.nodes
          .map((node: TNode | TNodeGroup) => {
            if (node.isGroup) {
              const nodeGroup = node as TNodeGroup;
              return [nodeGroup.idx, nodeGroup.nodeIndicesDeep];
            }
            return [node.idx];
          })
          .flat()
          .flat(),
      ),
    ];
  }

  get nodeItems(): TNode[] {
    return this._nodes.filter((node: TNode | TNodeGroup) => node.isNode) as TNode[];
  }

  get nodeItemsDeep(): TNode[] {
    return [
      ...new Set(
        this.nodes
          .map((node: TNode | TNodeGroup) => {
            if (node.isGroup) {
              const nodeGroup = node as TNodeGroup;
              return nodeGroup.nodeItemsDeep as TNode[];
            }
            return node as TNode;
          })
          .flat(),
      ),
    ];
  }

  get nodes(): (TNode | TNodeGroup)[] {
    return this._nodes;
  }

  get nodesDeep(): (TNode | TNodeGroup)[] {
    const nodeIndices = this.nodeIndicesDeep;
    return this.parent.nodes.filter((node: TNode | TNodeGroup) => nodeIndices.includes(node.idx));
  }

  get parent(): TNodes | TNodeGroup {
    return this._parent;
  }

  get parentNodes(): TNodes {
    return this._parent as TNodes;
  }

  get show(): boolean {
    return this._parent.showNode(this);
  }

  get size(): number {
    return 0;
  }

  get sourceNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.targetIdx === this.idx)
      .map((connection: TConnection) => connection.sourceNode);
  }

  get spatial(): undefined {
    return;
  }

  get targetNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.sourceIdx === this.idx)
      .map((connection: TConnection) => connection.targetNode);
  }

  get toCode(): string {
    return this.nodes.map((node: TNode | TNodeGroup) => node.view.label).join(" + ");
  }

  get view(): NodeGroupView {
    return this._view;
  }

  /**
   * Add node.
   */
  addNode(idx: number): void {
    this._nodes.push(this._parent.nodes[idx]);
  }

  /**
   * Observer for node group changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this.logger.trace("changes");

    this.update();
    this.parent.network.changes();
  }

  /**
   * Clean node group.
   */
  clean(): void {
    this.view.updateCentroid();
  }

  /**
   * Clone this node group component.
   * @return node group component.
   */
  clone(withConnections: boolean = true): TNodeGroup {
    this.logger.trace("clone");

    const nodeEntries: [number, number][] = this.nodes.map((node: TNode | TNodeGroup) => [
      node.idx,
      node.clone(false).idx,
    ]);
    const indicesNew = nodeEntries.map((idx: [number, number]) => idx[1]);

    const nodeGroup = this.network.nodes.addNodeGroup({
      ...this.toJSON(),
      nodes: indicesNew,
    });

    if (withConnections) {
      const indicesDeepOld = this.nodeIndicesDeep;
      const indicesDeepNew = nodeGroup.nodeIndicesDeep;

      const nodeIndices = Object.fromEntries(indicesDeepOld.map((old, idx) => [old, indicesDeepNew[idx]]));
      nodeIndices[this.idx] = nodeGroup.idx;

      this.connectionsWithin.forEach((connection: TConnection) => {
        const connectionProps = connection.toJSON();
        connectionProps.source = nodeIndices[connectionProps.source];
        connectionProps.target = nodeIndices[connectionProps.target];
        const clonedConnection = this.network.connections.addConnection(connectionProps);

        clonedConnection.init();
      });
    }

    // Initialize node.
    nodeGroup.init();

    return nodeGroup;
  }

  /**
   * Initialize node group.
   */
  init(): void {
    this.logger.trace("init");

    this.update();
  }

  /**
   * Delete node group.
   *
   * @remarks
   * It removes node group component of the network.
   */
  remove(): void {
    this.network.deleteNode(this);
  }

  /**
   * Remove code nodes.
   */
  removeCodeNodes(): void {}

  /**
   * Remove node item or group
   * @param node node object
   */
  removeNode(node: TNode | TNodeGroup): void {
    this._nodes = this._nodes.filter((n: TNode | TNodeGroup) => n !== node);
  }

  /**
   * Select this node group.
   */
  select(): void {
    this._parent.selectNode(this);
  }

  /**
   * Select this node as source for connection.
   */
  selectForConnection(): void {
    this._parent.network.connections.state.selectedNode = this;
  }

  /**
   * Serialize for JSON.
   * @return node group props
   */
  toJSON(): INodeGroupProps {
    return {
      nodes: this.nodes.map((node: TNode | TNodeGroup) => node.idx),
    };
  }

  /**
   * Toggle the selection of this node group.
   */
  toggleSelection(): void {
    this._parent.toggleNodeSelection(this);
  }

  /**
   * Unselect this node group.
   */
  unselect(): void {
    this._parent.unselectNode(this);
  }

  /**
   * Update node.
   */
  update(): void {
    this.view.updateCentroid();
    this.updateHash();
  }

  /**
   * Update hash.
   */

  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
