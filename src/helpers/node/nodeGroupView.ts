// nodeGroupView.ts

import { reactive, UnwrapRef } from "vue";

import { BaseObj } from "../common/base";
import { NodeGroup } from "./nodeGroup";
import { polygonCentroid } from "d3";
import { polygonGenerator } from "../nodeGraph/nodeGroupGraph";

export interface INodeGroupViewProps {
  color?: string;
  visible?: boolean;
}

interface INodeGroupViewState {
  centroid: { x: number; y: number };
  color?: string;
  connectionPanelIdx: number | null;
  label: string;
  margin: number;
  visible?: boolean;
  polygon: [number, number][];
}

export class NodeGroupView extends BaseObj {
  public _nodeGroup: NodeGroup; // parent
  private _state: UnwrapRef<INodeGroupViewState>;

  constructor(
    nodeGroup: NodeGroup,
    viewProps: INodeGroupViewProps = {
      visible: true,
    }
  ) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._nodeGroup = nodeGroup;
    this._state = reactive({
      ...viewProps,
      connectionPanelIdx: null,
      centroid: { x: 0, y: 0 },
      label: "",
      margin: 1,
      polygon: [],
    });

    this.updateCentroid();
  }

  get color(): string {
    if (this._state.color) {
      return this._state.color;
    }
    return this._nodeGroup.parent.network.getNodeColor(this._nodeGroup.idx);
  }

  set color(value: string) {
    this._state.color = value === "none" || value === "" ? undefined : value;

    this._nodeGroup.network.updateStyle();
    this._nodeGroup.network.clean();
  }

  get connectionPanelIdx(): number | null {
    return this._state.connectionPanelIdx;
  }

  set connectionPanelIdx(value: number | null) {
    this._state.connectionPanelIdx = value;

    if (this._state.connectionPanelIdx != null) {
      this.nodeGroup.connections[this._state.connectionPanelIdx].state.select();
    }
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
    if (this._state.label) {
      return this._state.label;
    }

    const label = "g" + (this.idx + 1);
    return label;
  }

  get nodeGroup(): NodeGroup {
    return this._nodeGroup;
  }

  get opacity(): boolean {
    const connections = this.nodeGroup.parent.network.connections;
    const nodes = this.nodeGroup.parentNodes;
    return (
      true ||
      connections.state.selectedNode == null ||
      (connections.state.selectedNode != null &&
        this.nodeGroup.isSelectedForConnection) ||
      (nodes.state.focusedNode != null && this.isFocused)
    );
  }

  get position(): { x: number; y: number } {
    return this._state.centroid;
  }

  get state(): UnwrapRef<INodeGroupViewState> {
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
   * Serialize for JSON.
   * @return node view object
   */
  toJSON(): INodeGroupViewProps {
    const nodeGroupViewProps: INodeGroupViewProps = {};

    if (this._state.color) {
      nodeGroupViewProps.color = this._state.color;
    }

    return nodeGroupViewProps;
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
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      color: this.color,
    });
  }

  /**
   * Update element for node color.
   */
  updateStyle(): void {
    const root = document.documentElement;
    root.style.setProperty(
      "--node" + this._nodeGroup.idx + "-color",
      this.color
    );
  }
}
