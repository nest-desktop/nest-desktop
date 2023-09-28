// gridPositions.ts

import { range } from "@/helpers/common/array";
import { round } from "@/utils/converter";

import { NESTNodeSpatial } from "./nodeSpatial";

export interface GridPositionsProps {
  center?: number[];
  edgeWrap?: boolean;
  extent?: number[];
  numDimensions: number;
  shape?: number[];
}

export class GridPositions {
  private readonly _name = "grid";
  private _center: number[] = [0, 0];
  private _edgeWrap: boolean = false;
  private _extent: number[] = [1, 1];
  private _numDimensions: number = 2;
  private _pos: number[][] = [];
  private _shape: number[] = [1, 1];
  private _spatial: NESTNodeSpatial;

  constructor(spatial: NESTNodeSpatial, positions?: GridPositionsProps) {
    this._spatial = spatial;

    if (positions) {
      this._numDimensions = positions.numDimensions || 2;
      this._center = positions.center || new Array(this._numDimensions).fill(0);
      this._extent = positions.extent || new Array(this._numDimensions).fill(1);
      this._shape = positions.shape || new Array(this._numDimensions).fill(1);
      this._edgeWrap = positions.edgeWrap || false;
    }
  }

  get center(): number[] {
    return this._center;
  }

  set center(value: number[]) {
    this._center = value;
  }

  get edgeWrap(): boolean {
    return this._edgeWrap;
  }

  set edgeWrap(value: boolean) {
    this._edgeWrap = value;
  }

  get extent(): number[] {
    return this._extent;
  }

  set extent(value: number[]) {
    this._extent = value;
  }

  get name(): string {
    return this._name;
  }

  get numDimensions(): number {
    return this._numDimensions;
  }

  set numDimensions(value: number) {
    this._numDimensions = value;
    this._center = new Array(this._numDimensions).fill(0);
    this._extent = new Array(this._numDimensions).fill(1);
    this._shape = new Array(this._numDimensions).fill(1);
  }

  get pos(): number[][] {
    return this._pos;
  }

  set pos(value: number[][]) {
    this._pos = value;
  }

  get shape(): number[] {
    return this._shape;
  }

  set shape(values: number[]) {
    this._shape = values;
  }

  get spatial(): NESTNodeSpatial {
    return this._spatial;
  }

  generate(): void {
    const minX: number = this._center[0] - this._extent[0] / 2;
    const maxX: number = this._center[0] + this._extent[0] / 2;
    const minY: number = this._center[1] - this._extent[1] / 2;
    const maxY: number = this._center[1] + this._extent[1] / 2;
    const X: number[] = this.range(minX, maxX, this._shape[0]);
    const Y: number[] = this.range(minY, maxY, this._shape[1]);

    this._pos = [];
    X.forEach((x: number) => {
      Y.forEach((y: number) => {
        this._pos.push([round(x), round(y)]);
      });
    });
  }

  range(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    const rangeData: number[] = range(min, max, step);
    return rangeData.filter((_: number, i: number) => i % 2 === 1);
  }

  /**
   * Generate the Python code for grid positions, i.e. non-free positions.
   */
  toPythonCode(): string {
    return `nest.spatial.grid(${JSON.stringify(this._shape)})`;
  }

  /**
   * Serialize for JSON.
   * @return grid positons object
   */
  toJSON(): GridPositionsProps {
    return {
      center: this._center,
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      numDimensions: this._numDimensions,
      shape: this._shape,
    };
  }
}
