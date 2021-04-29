import * as math from 'mathjs';
import { sha1 } from 'object-hash';

import { Config } from '../config';
import { Node } from './node';

export class FreePositions {
  private readonly _name = 'free';
  private _edgeWrap: boolean;
  private _extent: number[];
  private _numDimensions: number;
  private _pos: any;
  private _spatial: NodeSpatial;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this._spatial = spatial;

    this._pos = positions.pos || [];
    this._numDimensions = positions.numDimensions || 2;
    this._extent = positions.extent || new Array(this._numDimensions).fill(1);
    this._edgeWrap = positions.edgeWrap || false;
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

  /**
   * Rounds down the value (to two places after the comma).
   */
  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  /**
   * Generate positions.
   */
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

  /**
   * Write code for free positons.
   */
  toCode(): string {
    let args: string[] = [];
    if (this._pos.length > 0) {
      args.push(
        '[' +
          this._pos
            .map((p: number[]) => {
              const plist: string[] = p.map((pp: number) => pp.toFixed(2));
              return '[' + plist.join(',') + ']';
            })
            .join(',') +
          ']'
      );
    } else {
      args.push(`nest.random.uniform(-0.5, 0.5)`);
      args.push(`num_dimensions=${this._numDimensions}`);
    }
    return (
      'nest.spatial.free(' +
      this.spatial.node.code._(2) +
      args.join(',' + this.spatial.node.code._(2)) +
      this.spatial.node.code._(1) +
      ')'
    );
  }

  toJSON(): any {
    const positions: any = {
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

export class NodeSpatial extends Config {
  private _hash: string;
  private _node: Node;
  private _positions: FreePositions | GridPositions | undefined;

  constructor(node: Node, spatial: any) {
    super('NodeSpatial');
    this._node = node;
    this.init(spatial);
  }

  get hash(): string {
    return this._hash;
  }

  get node(): Node {
    return this._node;
  }

  get positions(): FreePositions | GridPositions | undefined {
    return this._positions;
  }

  /**
   * Update hash of the spatial node.
   */
  updateHash(): void {
    this._hash = sha1(JSON.stringify(this.toJSON()));
  }

  /**
   * Initialize spatial node.
   */
  init(spatial: any) {
    switch (spatial.positions) {
      case 'free':
        this._positions = new FreePositions(this, spatial.specs);
        break;
      case 'grid':
        this._positions = new GridPositions(this, spatial.specs);
        break;
      default:
        this._positions = undefined;
    }
  }

  /**
   * Check if it has positions (free or grid) component.
   */
  hasPositions(): boolean {
    return this._positions !== undefined;
  }

  toJSON(): any {
    let spatial: any;
    if (this._positions === undefined) {
      spatial = {};
    } else {
      spatial = {
        positions: this._positions.name,
        specs: this._positions.toJSON(),
      };
    }
    return spatial;
  }
}
