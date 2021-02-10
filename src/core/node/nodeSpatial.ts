import * as math from 'mathjs';

import { Config } from '../config';
import { Node } from './node';

export class FreePositions {
  private readonly _name = 'free';
  private _center: number[]; // FreePositions has no argument for center in NEST 3.
  private _edgeWrap: boolean;
  private _extent: number[];
  private _numDimensions: number;
  private _pos: any;
  private _spatial: NodeSpatial;

  rows?: number;
  columns?: number;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this._spatial = spatial;

    this._pos = positions.pos;
    this._numDimensions = positions.numDimensions || 2;
    this._center = positions.center || [0, 0];
    this._extent = positions.extent || [1, 1];
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
  }

  get pos(): number[][] {
    return this._pos;
  }

  set pos(value: number[][]) {
    this._pos = value;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  generate(): void {
    const minX: number = (-1 * this._extent[0]) / 2;
    const maxX: number = this._extent[0] / 2;
    const minY: number = (-1 * this._extent[1]) / 2;
    const maxY: number = this._extent[1] / 2;
    const minZ: number = (-1 * this._extent[2]) / 2;
    const maxZ: number = this._extent[2] / 2;
    // console.log(center,extent,minX,maxX,minY,maxY,length)

    this._pos = Array.from({ length: this._spatial.node.size }, () => {
      const x: number = math.random(minX, maxX);
      const y: number = math.random(minY, maxY);
      const pos: number[] = [this.round(x), this.round(y)];
      if (this._numDimensions === 3) {
        const z: number = math.random(minZ, maxZ);
        pos.push(this.round(z));
      }
      return pos;
    });
  }

  toJSON(): any {
    const positions: any = {
      center: this._center,
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      numDimensions: this._numDimensions,
      pos: this._pos,
    };
    return positions;
  }
}

export class GridPositions {
  private readonly _name = 'grid';
  private _center: number[];
  private _edgeWrap: boolean;
  private _extent: number[];
  private _pos: number[][];
  private _shape: number[];
  private _spatial: NodeSpatial;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this._spatial = spatial;

    this._shape = positions.shape || [1, 1];
    this._center = positions.center || [0, 0];
    this._extent = positions.extent || [1, 1];
    this._edgeWrap = positions.edgeWrap || false;
  }

  get center(): number[] {
    return this._center;
  }

  set center(value: number[]) {
    this._center = value;
  }

  get columns(): number {
    return this._shape[1];
  }

  set columns(value: number) {
    this._shape[1] = value;
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

  get rows(): number {
    return this._shape[0];
  }

  set rows(value: number) {
    this._shape[0] = value;
  }

  get pos(): number[][] {
    return this._pos;
  }

  set pos(value: number[][]) {
    this._pos = value;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
  }

  get numDimensions(): number {
    return 2;
  }

  set numDimensions(value: number) {}

  generate(): void {
    const minX: number = this._center[0] - this._extent[0] / 2;
    const maxX: number = this._center[0] + this._extent[0] / 2;
    const minY: number = this._center[1] - this._extent[1] / 2;
    const maxY: number = this._center[1] + this._extent[1] / 2;
    const X: number[] = this.range(minX, maxX, this.rows);
    const Y: number[] = this.range(minY, maxY, this.columns);
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
    return range._data.filter((v: number, i: number) => i % 2 === 1);
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  toJSON(): any {
    const positions: any = {
      center: this._center,
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      shape: this._shape,
    };
    return positions;
  }
}

export class NodeSpatial extends Config {
  node: Node;
  private _positions: FreePositions | GridPositions;

  constructor(node: Node, spatial: any = {}) {
    super('NodeSpatial');
    this.node = node;
    this.initPositions(spatial);
  }

  get positions(): FreePositions | GridPositions {
    return this._positions;
  }

  initPositions(spatial: any) {
    this._positions = undefined;
    if (Object.keys(spatial).length > 0) {
      if (spatial.hasOwnProperty('numDimensions')) {
        this._positions = new FreePositions(this, spatial);
      } else if (spatial.hasOwnProperty('shape')) {
        this._positions = new GridPositions(this, spatial);
      }
    }
    if (this.hasPositions()) {
      this._positions.generate();
    }
  }

  hasPositions(): boolean {
    return this._positions !== undefined;
  }

  isRandom(): boolean {
    return this.hasPositions() && this._positions.name === 'free';
  }

  toJSON(): any {
    const nodeSpatial: any = this._positions.toJSON();
    return nodeSpatial;
  }
}
