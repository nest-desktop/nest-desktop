// nodeView.ts

import { type UnwrapRef, nextTick, reactive } from "vue";

import type { TConnection } from "@/types";
import { BaseObj, type IBaseState } from "@/core";

import type { BaseNode } from "./node";
import type { NodeRecord } from "./nodeRecord";

import { useNetworkGraph } from "@/networkGraph";
const networkGraph = useNetworkGraph();

export interface INodeViewState extends IBaseState {
  color?: string;
  elementType?: string;
  position: { x: number; y: number };
  synWeights?: string;
  visible?: boolean;
}

interface INodeViewRefState {
  color?: string;
  expansionPanels: number[];
  label?: string;
  position: { x: number; y: number };
  positions?: number[][];
  showSize: boolean;
  synWeights?: string;
  visible?: boolean;
}

export class NodeView<TNode extends BaseNode = BaseNode> extends BaseObj {
  public _node: TNode; // parent
  private _state: UnwrapRef<INodeViewRefState>;

  constructor(
    node: TNode,
    viewState: INodeViewState = {
      position: { x: 0, y: 0 },
      visible: true,
    },
  ) {
    super();

    this._node = node;
    this._state = reactive<INodeViewRefState>({
      expansionPanels: [0],
      label: "",
      positions: [],
      showSize: this.node.size?.value > 1,
      synWeights: "",
      ...viewState,
    });
  }

  get color(): string {
    if (this.state.color) {
      return this.state.color;
    } else if (this.node.model.isRecorder && this.node.connectedNodes.length === 1) {
      return this.node.connectedNodes[0]?.view.color ?? "black";
    }
    return this.node.network.getNodeColor(this.node.idx);
  }

  set color(value: string) {
    this.state.color = value === "none" || value === "" ? undefined : value;

    // this.node.network.updateStyle();
    this.updateStyle();
    this.node.network.clean();
  }

  override get hashObject(): IBaseState {
    return {
      color: this.color,
      position: this.state.position,
    };
  }

  /**
   * Check if this node is focused.
   */
  get isFocused(): boolean {
    return this.node.nodes.state.focusedNode === this.node;
  }

  get label(): string {
    if (this.state.label) return this.state.label;

    let nodes: TNode[];
    let idx: number;
    let label: string;
    // let varname: string;

    switch (this.node.elementType) {
      case "neuron":
        nodes = this.node.nodes.neurons;
        idx = nodes.indexOf(this._node);
        label = "n" + (idx + 1);
        break;
      // case "stimulator":
      //   nodes = this.nodes.stimulators;
      //   idx = nodes.indexOf(this._node);
      //   varname = this._node.modelId.slice(0, this._node.modelId.length - 10);
      //   label = varname + (idx + 1);
      //   break;
      case undefined:
        nodes = this.node.nodes.nodeItems;
        idx = nodes.indexOf(this._node);
        label = "n" + (idx + 1);
        break;
      default:
        nodes = this.node.nodes.filterByModelId(this.node.modelId);
        idx = nodes.indexOf(this._node);
        label =
          this.node.model.abbreviation ||
          this.node.modelId
            .split("_")
            .map((d: string) => d[0])
            .join("");
        label += idx + 1;
    }

    return label;
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

  get state(): UnwrapRef<INodeViewRefState> {
    return this._state;
  }

  get showSize(): boolean {
    return this._state.showSize;
  }

  set showSize(value: boolean) {
    this.state.showSize = value;
    this.node.codeNode.inputs.size.setHidden(!value);
    this.node.codeNode.code.engine.runOnce(null);
    this.node.changes({ preventSimulation: true });
  }

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
        (this.state.synWeights === "inhibitory" ? -1 : 1) * Math.abs(connection.synapse.params.weightValue);
      connection.synapse.params.weight.hidden = false;
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
    this.state.synWeights = synWeights;

    nextTick(() => networkGraph.value?.render());
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
   * Focus node.
   */
  focus(): void {
    this.node.nodes.state.focusedNode = this.node as TNode;
  }

  /**
   * Initialize node view.
   */
  init(): void {
    this.state.showSize = !this.node.codeNode?.inputs.size.hidden;
  }

  /**
   * Load node view from state
   * @param nodeViewState node view state
   */
  load(nodeViewState: INodeViewState): void {
    if (nodeViewState.position) this.state.position = nodeViewState.position;
    if (nodeViewState.synWeights) this.state.synWeights = nodeViewState.synWeights;
    if (nodeViewState.color) this.state.color = nodeViewState.color;
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
   * Save node view to state.
   * @return node view state
   */
  override save(): INodeViewState {
    const nodeViewState: INodeViewState = {
      position: this.state.position,
    };

    if (this.state.synWeights) nodeViewState.synWeights = this.state.synWeights;
    if (this.state.color) nodeViewState.color = this.state.color;

    return nodeViewState;
  }

  /**
   * Update element for node color.
   */
  updateStyle(): void {
    const root = document.documentElement;
    root.style.setProperty("--colorNode" + this.node.idx, this.color);
  }
}
