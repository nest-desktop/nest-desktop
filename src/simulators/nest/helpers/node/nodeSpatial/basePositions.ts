// basePositions.ts

import { NESTNodeSpatial } from "./nodeSpatial";

export interface IBasePositionsProps {
  edgeWrap?: boolean;
  numDimensions?: number;
  pos?: number[][];
}

export class BasePositions {
  private _edgeWrap: boolean = false;
  public _numDimensions: number = 2;
  private _pos: number[][] = [];
  private _spatial: NESTNodeSpatial;

  constructor(spatial: NESTNodeSpatial, positionProps?: IBasePositionsProps) {
    this._spatial = spatial;
    this.update(positionProps);
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
    return [];
  }

  get numDimensions(): number {
    return this._numDimensions;
  }

  set numDimensions(value: number) {
    this._numDimensions = value;
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
    return "";
  }

  /**
   * Serialize for JSON.
   * @return positions props
   */
  toJSON(): IBasePositionsProps {
    return {
      edgeWrap: this._edgeWrap,
      numDimensions: this._numDimensions,
      pos: this._pos,
    };
  }

  update(positionProps?: IBasePositionsProps) {
    if (positionProps?.pos) {
      this._pos = positionProps.pos;
    }

    if (positionProps?.numDimensions) {
      this._numDimensions = positionProps.numDimensions;
    }

    if (positionProps?.edgeWrap) {
      this._edgeWrap = positionProps.edgeWrap;
    }
  }
}
