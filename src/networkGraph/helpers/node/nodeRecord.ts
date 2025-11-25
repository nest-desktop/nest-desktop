// nodeRecord.ts

import * as d3 from "d3";
import { type UnwrapRef, reactive } from "vue";

import type { TNode } from "@/types";

import type { IModelState } from "@/helpers/model";
import { Activity } from "@/helpers/activity";
import { BaseObj } from "@/helpers/common";
import { max, min } from "@/utils/array";

export interface INodeRecordState extends IModelState {
  color?: string;
  recorderId?: string;
}
interface INodeRecordRefState {
  color: string;
  colorMap: {
    min: number;
    max: number;
    reverse: boolean;
    scale: string;
  };
  traceColors: string[];
}

export class NodeRecord extends BaseObj<INodeRecordState> {
  // private _activity: Activity;
  private _id: string = "";
  private _label: string = "";
  private _node: TNode;
  private _nodeSize: number = 0;
  private _recorderId: string = "";
  private _state: UnwrapRef<INodeRecordRefState>;
  private _unit: string = "";

  constructor(node: TNode) {
    super({
      config: { name: "NodeRecord" },
    });

    this._node = node;
    // this._activity = node.activity;

    this._state = reactive<INodeRecordRefState>({
      color: "",
      colorMap: {
        max: -55.0,
        min: -70.0,
        reverse: false,
        scale: "Spectral",
      },
      traceColors: [],
    });

    this.updateColor();
  }

  get activity(): Activity {
    return this.node.activity as Activity;
  }

  get color(): string | string[] {
    switch (this.activity.chartGraph.state.traceColor) {
      case "node":
        return this._node.view.color;
      case "record":
        return this._state.color;
      case "trace":
        return this._state.traceColors;
    }
    return this._state.color;
  }

  get groupId(): string {
    return this._recorderId + "." + this.id;
  }

  get hasEvent(): boolean {
    return this.node.activity ? this.id in this.node.activity.events : false;
  }

  get hasValues(): boolean {
    return this.values.length > 0;
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  get labelCapitalize(): string {
    return this._label.charAt(0).toUpperCase() + this._label.slice(1);
  }

  get node(): TNode {
    return this._node;
  }

  set node(value: TNode) {
    this._node = value;
    this._recorderId = this._node.view.label;
  }

  get nodeLabel(): string {
    return this.node.view.label;
  }

  get nodeSize(): number {
    return this._nodeSize;
  }

  get recorderId(): string {
    return this._recorderId;
  }

  get state(): UnwrapRef<INodeRecordRefState> {
    return this._state;
  }

  get times(): number[] {
    return this.node.activity?.events.times || [];
  }

  get title(): string {
    return this.labelCapitalize + (this.unit ? ` (${this.unit})` : "");
  }

  get unit(): string {
    return this._unit;
  }

  get values(): number[] {
    return this.node.activity?.events[this._id] || [];
  }

  /**
   * Get color.
   * @param idx index of color cycle
   * @returns node color name
   */
  getColor(idx: number): string {
    const colors: string[] = this.config?.localStorage.color.cycle;
    return colors[idx % colors.length] ?? "black";
  }

  /**
   * Load node record from state.
   * @param state node record state
   */
  load(state: INodeRecordState): void {
    if (state.id) this._id = state.id;
    this._recorderId = state.recorderId || this.node.view.label;
    if (state.label) this._label = state.label;
    if (state.unit) this._unit = state.unit as string;
  }

  /**
   * Normalize value for color or height.
   */
  normalize(value: number): number {
    const min: number = this._state.colorMap.min;
    const max: number = this._state.colorMap.max;
    return (value - min) / (max - min);
  }

  /**
   * Save node record to state.
   * @returns node record state
   */
  override save(): INodeRecordState {
    return {
      id: this.id,
      color: this.state.color,
      recorderId: this.recorderId,
    };
  }

  /**
   * Update node record.
   */
  update(): void {
    this.logger.trace("update");

    this._nodeSize = this.node.activity?.nodeIds.length || 0;
    if (this.nodeSize != this.state.traceColors.length) this.updateTraceColors();

    this.updateColorMap();
  }

  /**
   * Update color of the node record.
   */
  updateColor(): void {
    this.state.color = this.node.view.color;
  }

  /**
   * Update state of node record.
   * @remarks It requires network activity.
   */
  updateColorMap(): void {
    if (!this.hasEvent || !this.hasValues) return;

    const values = this.values;
    this.state.colorMap.max = max(values);
    this.state.colorMap.min = min(values);
  }

  updateTraceColors(): void {
    this.state.traceColors.slice(0, this.nodeSize);

    if (this.nodeSize > this.state.traceColors.length) {
      const arrayIdx = [...Array(this.nodeSize - this.state.traceColors.length).keys()];
      this.state.traceColors = [
        ...this.state.traceColors,
        ...arrayIdx.map((idx) =>
          this.nodeSize == 1 ? this.state.color : this.getColor(idx + this.state.traceColors.length),
        ),
      ];
    }
  }

  /**
   * RGB color for a value in range [0 - 1].
   */
  valueColor(value: number): string {
    const colorMap: string = `interpolate${this._state.colorMap.scale}`;
    const colorScale = d3[colorMap];
    return colorScale(this._state.colorMap.reverse ? 1 - value : value);
  }
}
