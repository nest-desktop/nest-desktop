// basePositions.ts

import { NESTNodeSpatial } from "./nodeSpatial";

export interface BasePositionsProps {
  edgeWrap?: boolean;
  extent?: number[];
  numDimensions: number;
  pos?: number[][];
}

export class BasePositions {
  private _edgeWrap: boolean = false;
  private _extent: number[] = [1, 1];
  private _numDimensions: number = 2;
  private _pos: number[][] = [];
  private _spatial: NESTNodeSpatial;

  constructor(spatial: NESTNodeSpatial, positionProps?: BasePositionsProps) {
    this._spatial = spatial;

    if (positionProps) {
      this._pos = positionProps.pos || [];
      this._numDimensions = positionProps.numDimensions || 2;
      this._extent =
        positionProps.extent || new Array(this._numDimensions).fill(1);
      this._edgeWrap = positionProps.edgeWrap || false;
    }
  }

  get center(): number[] {
    return [];
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

  get posAsString(): string {
    return (
      "[" +
      this._pos.map(
        (p: number[]) =>
          "[" + p.map((pp: number) => pp.toFixed(2)).join(",") + "]"
      ) +
      "]"
    );
  }

  get posExisted(): boolean {
    return this._pos.length > 0;
  }

  get spatial(): NESTNodeSpatial {
    return this._spatial;
  }

  get shape(): number[] {
    return [];
  }

  /**
   * Generate positions.
   */
  generate(): void {}

  /**
   * Indent code.
   */
  _(n: number = 1): string {
    return "\n" + "  ".repeat(n);
  }

  /**
   * Generate the Python code for free (i.e. non-grid) positions.
   */
  toPythonCode(): string {
    // import('./templates/freePositions.mustache').then((template) => {
    //   console.log(template)
    // })
    // const template = require(`./freePositions.mustache`);

    // const rendered = Mustache.render(template, this);
    // return rendered;
    return "";
  }

  /**
   * Serialize for JSON.
   * @return positions props
   */
  toJSON(): BasePositionsProps {
    return {
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      numDimensions: this._numDimensions,
      pos: this._pos,
    };
  }
}
