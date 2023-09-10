// freePositions.ts

import { randomUniformFloat } from "@/helpers/common/random";
import { round } from "@/utils/converter";

import { NESTNodeSpatial } from "./nestNodeSpatial";

export interface FreePositionsProps {
  edgeWrap?: boolean;
  extent?: number[];
  numDimensions: number;
  pos?: number[][];
}

export class FreePositions {
  private readonly _name = "free";
  private _edgeWrap: boolean = false;
  private _extent: number[] = [1, 1];
  private _numDimensions: number = 2;
  private _pos: number[][] = [];
  private _spatial: NESTNodeSpatial;

  constructor(spatial: NESTNodeSpatial, positions?: FreePositionsProps) {
    this._spatial = spatial;

    if (positions) {
      this._pos = positions.pos || [];
      this._numDimensions = positions.numDimensions || 2;
      this._extent = positions.extent || new Array(this._numDimensions).fill(1);
      this._edgeWrap = positions.edgeWrap || false;
    }
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

    this._pos = Array.from({ length: this._spatial.node.size }, () => {
      const x: number = randomUniformFloat(minX, maxX);
      const y: number = randomUniformFloat(minY, maxY);
      const pos: number[] = [round(x), round(y)];
      if (this._numDimensions === 3) {
        const z: number = randomUniformFloat(minZ, maxZ);
        pos.push(round(z));
      }
      return pos;
    });
  }

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
   * @return free positons object
   */
  toJSON(): FreePositionsProps {
    return {
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      numDimensions: this._numDimensions,
      pos: this._pos,
    };
  }
}
