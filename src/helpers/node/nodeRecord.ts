// nodeRecord.ts

import * as d3 from "d3";

import { TNode } from "@/types";

import { Activity } from "../activity/activity";
import { max, min } from "../common/array";
import { BaseObj } from "../common/base";

export interface INodeRecordProps {
  id: string;
  color: string;
  groupId: string;
  label?: string;
  unit?: string;
}

interface IColorMap {
  min: number;
  max: number;
  reverse: boolean;
  scale: string;
}

export class NodeRecord extends BaseObj {
  // private _activity: Activity;
  private _color: string = "blue";
  private _colorMap: IColorMap = {
    max: -55,
    min: -70,
    reverse: false,
    scale: "Spectral",
  };
  private _groupId: string = "0";
  private _id: string;
  private _label: string;
  private _node: TNode;
  private _nodeSize: number = 0;
  private _unit: string;

  constructor(node: TNode, nodeRecordProps: INodeRecordProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._node = node;
    // this._activity = node.activity;

    this._id = nodeRecordProps.id;
    this._label = nodeRecordProps.label || "";
    this._unit = nodeRecordProps.unit || "";

    this.updateGroupID();
    this.updateColor();
  }

  get activity(): Activity {
    return this._node.activity as Activity;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get colorMap(): IColorMap {
    return this._colorMap;
  }

  get groupId(): string {
    return this._groupId;
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

  get nodeLabel(): string {
    return this.node.view.label;
  }

  get nodeSize(): number {
    return this._nodeSize;
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
   * Normalize value for color or height.
   */
  normalize(value: number): number {
    const min: number = this._colorMap.min;
    const max: number = this._colorMap.max;
    return (value - min) / (max - min);
  }

  toJSON(): INodeRecordProps {
    return {
      id: this._id,
      color: this._color,
      groupId: this._groupId,
    };
  }

  /**
   * Update node record.
   */
  update(): void {
    this.logger.trace("update");

    this._nodeSize = this.node.activity?.nodeIds.length || 0;
    this.updateGroupID();
    this.updateState();
  }

  /**
   * Update color of the node record.
   */
  updateColor(): void {
    this._color = this.node.view.color;
  }

  /**
   * Update group id of node record.
   */
  updateGroupID(): void {
    this._groupId = this.id + "." + this.node.view.label;
  }

  /**
   * Update state of node record.
   *
   * @remarks:
   * It requires network activity.
   */
  updateState(): void {
    if (!this.hasEvent || !this.hasValues) return;

    const values = this.values;
    this._colorMap.max = max(values);
    this._colorMap.min = min(values);
  }

  /**
   * RGB color for a value in range [0 - 1].
   */
  valueColor(value: number): string {
    const colorMap: string = `interpolate${this._colorMap.scale}`;
    // @ts-ignore - Element implicitly has an 'any' type because expression of type 'string' can't be used to index type
    // 'typeof import("./node_modules/@types/d3/index")'.
    const colorScale = d3[colorMap];
    return colorScale(this._colorMap.reverse ? 1 - value : value);
  }
}
