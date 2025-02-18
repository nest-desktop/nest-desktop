// nodeRecord.ts

import * as d3 from "d3";
import { UnwrapRef, reactive } from "vue";

import { TNode } from "@/types";

import { Activity } from "../activity/activity";
import { BaseObj } from "../common/base";
import { IModelStateProps } from "../model/model";
import { max, min } from "../../utils/array";

export interface INodeRecordProps extends IModelStateProps {
  color?: string;
  recorderId?: string;
}
interface INodeRecordState {
  color: string;
  colorMap: {
    min: number;
    max: number;
    reverse: boolean;
    scale: string;
  };
  traceColors: string[];
}

export class NodeRecord extends BaseObj {
  // private _activity: Activity;
  private _id: string;
  private _label: string;
  private _node: TNode;
  private _nodeSize: number = 0;
  private _recorderId: string = "";
  private _state: UnwrapRef<INodeRecordState>;
  private _unit: string;

  constructor(node: TNode, nodeRecordProps: INodeRecordProps) {
    super({
      config: { name: "NodeRecord" },
      logger: { settings: { minLevel: 3 } },
    });

    this._node = node;
    // this._activity = node.activity;

    this._id = nodeRecordProps.id || "";
    this._recorderId = nodeRecordProps.recorderId || node.view.label;
    this._label = nodeRecordProps.label || "";
    this._unit = nodeRecordProps.unit || "";

    this._state = reactive<INodeRecordState>({
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
    return this._node.activity as Activity;
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
    return this._recorderId + "." + this._id;
  }

  get hasEvent(): boolean {
    return this._node.activity ? this._id in this._node.activity.events : false;
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

  get state(): UnwrapRef<INodeRecordState> {
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
    return colors[idx % colors.length];
  }

  /**
   * Normalize value for color or height.
   */
  normalize(value: number): number {
    const min: number = this._state.colorMap.min;
    const max: number = this._state.colorMap.max;
    return (value - min) / (max - min);
  }

  toJSON(): INodeRecordProps {
    return {
      id: this._id,
      color: this._state.color,
      recorderId: this._recorderId,
    };
  }

  /**
   * Update node record.
   */
  update(): void {
    this.logger.trace("update");

    this._nodeSize = this.node.activity?.nodeIds.length || 0;
    if (this._nodeSize != this.state.traceColors.length) this.updateTraceColors();

    this.updateColorMap();
  }

  /**
   * Update color of the node record.
   */
  updateColor(): void {
    this._state.color = this.node.view.color;
  }

  /**
   * Update state of node record.
   * @remarks It requires network activity.
   */
  updateColorMap(): void {
    if (!this.hasEvent || !this.hasValues) return;

    const values = this.values;
    this._state.colorMap.max = max(values);
    this._state.colorMap.min = min(values);
  }

  updateTraceColors(): void {
    this._state.traceColors.slice(0, this._nodeSize);

    if (this._nodeSize > this._state.traceColors.length) {
      const arrayIdx = [...Array(this._nodeSize - this._state.traceColors.length).keys()];
      this._state.traceColors = [
        ...this._state.traceColors,
        ...arrayIdx.map((idx) =>
          this.nodeSize == 1 ? this._state.color : this.getColor(idx + this._state.traceColors.length),
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
