import * as math from 'mathjs';

import { Node } from '../node';
import { NodeSpatial } from './nodeSpatial';

export class GridPositions {
  private readonly _name = 'grid';
  private _center: number[];
  private _edgeWrap: boolean;
  private _extent: number[];
  private _numDimensions: number;
  private _pos: number[][];
  private _shape: number[];
  private _spatial: NodeSpatial;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this._spatial = spatial;

    this._numDimensions = positions.numDimensions || 2;
    this._center = positions.center || new Array(this._numDimensions).fill(0);
    this._extent = positions.extent || new Array(this._numDimensions).fill(1);
    this._shape = positions.shape || new Array(this._numDimensions).fill(1);
    this._edgeWrap = positions.edgeWrap || false;
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

  get spatial(): NodeSpatial {
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
        this._pos.push([this.round(x), this.round(y)]);
      });
    });
  }

  range(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    const range: any = math.range(min, max, step);
    return range._data.filter((_: number, i: number) => i % 2 === 1);
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  /**
   * Write code for grid positons.
   */
  toCode(): string {
    return `nest.spatial.grid(${JSON.stringify(this._shape)})`;
  }

  /**
   * Serialize for JSON.
   * @return grid positons object
   */
  toJSON(): any {
    const positions: any = {
      center: this._center,
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      numDimensions: this._numDimensions,
      shape: this._shape,
    };
    return positions;
  }
}
