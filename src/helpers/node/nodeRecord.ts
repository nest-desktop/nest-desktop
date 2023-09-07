// nodeRecord.ts

import { Node } from "@/types/nodeTypes";
import { max, min } from "@/helpers/array";
import { Activity } from "../activity/activity";

export interface NodeRecordProps {
  id: string;
  color: string;
  groupId: string;
  label?: string;
  unit?: string;
}

export class NodeRecord {
  // private _activity: Activity;
  private _color: string = "blue";
  private _colorMap = {
    max: -55,
    min: -70,
    reverse: false,
    scale: "Spectral",
  };
  private _groupId: string = "0";
  private _id: string;
  private _label: string;
  private _node: Node;
  private _nodeSize: number = 0;
  private _unit: string;

  constructor(node: Node, record: NodeRecordProps) {
    this._node = node;
    // this._activity = node.activity;

    this._id = record.id;
    this._label = record.label || "";
    this._unit = record.unit || "";

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

  get colorMap(): any {
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

  get node(): Node {
    return this._node;
  }

  get nodeLabel(): string {
    return this.node.view.label;
  }

  get nodeSize(): number {
    return this._nodeSize;
  }

  get selectTitle(): string {
    return this.labelCapitalize + (this.unit ? ` (${this.unit})` : "");
  }

  get times(): number[] {
    return this.node.activity?.events.times || [];
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

  toJSON(): NodeRecordProps {
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
    // @ts-ignore
    const colorScale = d3[`interpolate${this._colorMap.scale}`];
    return colorScale(this._colorMap.reverse ? 1 - value : value);
  }
}
