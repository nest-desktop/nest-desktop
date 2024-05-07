// nodeGroupView.ts

import { reactive, UnwrapRef } from "vue";

import { BaseObj } from "../common/base";
import { NodeGroup } from "./nodeGroup";

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
    });
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

  get position(): { x: number; y: number } {
    return this._state.centroid;
  }

  get state(): UnwrapRef<INodeGroupViewState> {
    return this._state;
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
