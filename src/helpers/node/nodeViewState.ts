// nodeViewState.ts

import { UnwrapRef, nextTick, reactive } from "vue";

import { TConnection, TNode } from "@/types";

import { BaseObj } from "../common/base";
import { NodeRecord } from "./nodeRecord";

export interface INodeViewProps {
  color?: string;
  elementType?: string;
  position: { x: number; y: number };
  synWeights?: string;
  visible?: boolean;
}

interface INodeViewState {
  color?: string;
  expansionPanels: number[];
  position: { x: number; y: number };
  positions?: number[][];
  synWeights?: string;
  visible?: boolean;
}

export class NodeViewState extends BaseObj {
  public _node: TNode; // parent
  private _state: UnwrapRef<INodeViewState>;

  constructor(
    node: TNode,
    viewProps: INodeViewProps = {
      position: { x: 0, y: 0 },
      visible: true,
    },
  ) {
    super();

    this._node = node;
    this._state = reactive<INodeViewState>({
      expansionPanels: [0],
      positions: [],
      synWeights: "",
      ...viewProps,
    });
  }

  get color(): string {
    if (this.state.color) {
      return this.state.color;
    } else if (this.node.model?.isRecorder) {
      const connections: TConnection[] = this.node.network.connections.allConnections.filter(
        (connection: TConnection) => [connection.sourceIdx, connection.targetIdx].includes(this.node.idx),
      );
      if (connections.length === 1 && connections[0].sourceIdx !== connections[0].targetIdx) {
        const connection: TConnection = connections[0];
        const node: TNode = connection.sourceIdx === this.node.idx ? connection.targetNode : connection.sourceNode;
        return node.state.color;
      }
    }
    return this.node.network.getNodeColor(this.node.idx);
  }

  set color(value: string) {
    this.state.color = value === "none" || value === "" ? undefined : value;

    this.node.network.updateStyle();
    this.node.network.clean();
  }

  /**
   * Check if this node is focused.
   */
  get isFocused(): boolean {
    return this.node.nodes.state.focusedNode === this.node;
  }

  get node(): TNode {
    return this._node;
  }

  get opacity(): boolean {
    // const connections = this.node.nodes.network.connections;
    // const nodes = this.node.nodes;
    return true;
    // (
    //   connections.state.selectedNode == null ||
    //   (connections.state.selectedNode != null &&
    //     this.node.isSelectedForConnection) ||
    //   (nodes.state.focusedNode != null && this.isFocused)
    // );
  }

  get position(): { x: number; y: number } {
    return this._state.position;
  }

  get state(): UnwrapRef<INodeViewState> {
    return this._state;
  }

  // get showSize(): boolean {
  //   return this._state.showSize;
  // }

  // set showSize(value: boolean) {
  //   this._state.showSize = value;
  //   this._node.onUpdate({ preventSimulation: true });
  // }

  /**
   * Get term based on synapse weight.
   */
  get synWeights(): string {
    return this.state.synWeights || "excitatory";
  }

  set synWeights(value: string) {
    this.state.synWeights = value;
    this.node.connections.forEach((connection: TConnection) => {
      connection.synapse.params.weight.value =
        (this._state.synWeights === "inhibitory" ? -1 : 1) * Math.abs(connection.synapse.params.weight.value as number);
      connection.synapse.params.weight.visible = true;
    });
  }

  /**
   * Check synapse weights.
   */
  checkSynWeights(): void {
    this.logger.trace("check syn weights");
    const weights: number[] = this.node.connectionsNeuronTargets.map(
      (connection: TConnection) => connection.synapse.params.weight.value as number,
    );

    let synWeights = "mixed";
    if (weights.length === 0) synWeights = "excitatory";
    else {
      if (weights.every((weight: number) => weight > 0)) synWeights = "excitatory";
      if (weights.every((weight: number) => weight < 0)) synWeights = "inhibitory";
    }
    this._state.synWeights = synWeights;

    nextTick(() => this.node.network.graph?.render());
  }

  /**
   * Clean node.
   */
  clean(): void {}

  /**
   * Expand node panel.
   */
  expandNodePanel(): void {
    if (!this.state.expansionPanels.includes(0)) {
      this.state.expansionPanels.push(0);
    }
  }

  /**
   * Focus this node.
   */
  focus(): void {
    this.node.nodes.state.focusedNode = this.node as TNode;
  }

  /**
   * Get the record label.
   * @param recordId ID of the record
   */
  recordLabel(recordId: string): string {
    const recordables = this.node.recordables;
    const recordable = recordables.find((recordable: NodeRecord) => recordable.id == recordId);
    if (!recordable) return recordId;

    let label = `${recordable.label.slice(0, 1).toUpperCase()}${recordable.label.slice(1)}`;
    if (recordable.unit) label += ` (${recordable.unit})`;

    return label;
  }

  /**
   * Serialize for JSON.
   * @return node view object
   */
  toJSON(): INodeViewProps {
    const nodeViewProps: INodeViewProps = {
      position: this._state.position,
    };

    if (this._state.synWeights) nodeViewProps.synWeights = this._state.synWeights;
    if (this._state.color) nodeViewProps.color = this._state.color;

    return nodeViewProps;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      color: this.color,
      position: this._state.position,
    });
  }

  /**
   * Update element for node color.
   */
  updateStyle(): void {
    const root = document.documentElement;
    root.style.setProperty("--colorNode" + this.node.idx, this.color);
  }
}
