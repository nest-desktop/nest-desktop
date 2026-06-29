// nodeGroupView.ts

import { polygonCentroid } from "d3";
import { type UnwrapRef, reactive } from "vue";

import type { TNodeGroup } from "@/types";
import { BaseObj, type IBaseState } from "@/core";
import { polygonGenerator } from "@/networkGraph";

export interface INodeGroupViewState extends IBaseState {
  color?: string;
  visible?: boolean;
}

interface INodeGroupViewRefState {
  centroid: { x: number; y: number };
  color?: string;
  expansionPanelIdx: number | null;
  label: string;
  margin: number;
  visible?: boolean;
  polygon: [number, number][];
}

export class NodeGroupView extends BaseObj {
  public _nodeGroup: TNodeGroup; // parent
  private _state: UnwrapRef<INodeGroupViewRefState>;

  constructor(
    nodeGroup: TNodeGroup,
    viewState: INodeGroupViewState = {
      visible: true,
    },
  ) {
    super();

    this._nodeGroup = nodeGroup;
    this._state = reactive<INodeGroupViewRefState>({
      ...viewState,
      expansionPanelIdx: null,
      centroid: { x: 0, y: 0 },
      label: "",
      margin: 1,
      polygon: [],
    });

    this.updateCentroid();
  }

  get color(): string {
    if (this._state.color) return this._state.color;
    return this._nodeGroup.parent.network.getNodeColor(this._nodeGroup.idx);
  }

  set color(value: string) {
    this._state.color = value === "none" || value === "" ? undefined : value;

    this._nodeGroup.network.updateStyle();
    this._nodeGroup.network.clean();
  }

  get expansionPanelIdx(): number | null {
    return this._state.expansionPanelIdx;
  }

  set expansionPanelIdx(value: number | null) {
    this._state.expansionPanelIdx = value;

    if (this._state.expansionPanelIdx != null) this.nodeGroup.connections[this._state.expansionPanelIdx].state.select();
  }

  get idx(): number {
    const nodeGroups = this.nodeGroup.parent.nodeGroups;
    return nodeGroups.indexOf(this._nodeGroup);
  }

  /**
   * Check if this node group is focused.
   */
  get isFocused(): boolean {
    return this.nodeGroup.parentNodes.state.focusedNode === this.nodeGroup;
  }

  get label(): string {
    if (this._state.label) return this._state.label;

    const label = "g" + (this.idx + 1);
    return label;
  }

  get nodeGroup(): TNodeGroup {
    return this._nodeGroup;
  }

  get opacity(): boolean {
    // const connections = this.nodeGroup.parent.network.connections;
    // const nodes = this.nodeGroup.parentNodes;
    return true;
    // (
    //   connections.state.selectedNode == null ||
    //   (connections.state.selectedNode != null &&
    //     this.nodeGroup.isSelectedForConnection) ||
    //   (nodes.state.focusedNode != null && this.isFocused)
    // );
  }

  get position(): { x: number; y: number } {
    return this._state.centroid;
  }

  get state(): UnwrapRef<INodeGroupViewRefState> {
    return this._state;
  }

  /**
   * Get term based on synapse weight.
   */
  get synWeights(): string {
    return "excitatory";
  }

  /**
   * Clean node.
   */
  clean(): void {}

  /**
   * Focus this node.
   */
  focus(): void {
    this.nodeGroup.parentNodes.state.focusedNode = this.nodeGroup;
  }

  /**
   * Save node group view to state.
   * @return node view state
   */
  override save(): INodeGroupViewState {
    const nodeGroupViewState: INodeGroupViewState = {};

    if (this._state.color) nodeGroupViewState.color = this._state.color;

    return nodeGroupViewState;
  }

  /**
   * Update centroid.
   */
  updateCentroid(): void {
    const polygon = polygonGenerator(this.nodeGroup.nodeItemsDeep);
    this.state.polygon = polygon;

    const centroid = polygonCentroid(polygon);
    this.state.centroid.x = centroid[0];
    this.state.centroid.y = centroid[1];
  }

  /**
   * Update element for node color.
   */
  updateStyle(): void {
    const root = document.documentElement;
    root.style.setProperty(`--colorNode${this.nodeGroup.idx}`, this.color);
  }
}
