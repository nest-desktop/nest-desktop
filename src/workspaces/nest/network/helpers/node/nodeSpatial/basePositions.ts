// basePositions.ts

import { NESTNodeSpatial } from "./nodeSpatial";

export interface IBasePositionsState {
  edgeWrap?: boolean;
  numDimensions?: number;
  pos?: number[][];
}

export class BasePositions {
  private _edgeWrap: boolean = false;
  public _numDimensions: number = 2;
  private _pos: number[][] = [];
  private _spatial: NESTNodeSpatial;

  constructor(spatial: NESTNodeSpatial) {
    this._spatial = spatial;
  }

  get center(): number[] {
    return [];
  }

  /**
   * Get rendered Python code.
   */
  get code(): string {
    return "";
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
    return "[" + this._pos.map((p: number[]) => "[" + p.map((pp: number) => pp.toFixed(2)).join(",") + "]") + "]";
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
   * Load positions from state
   * @param state positions state
   */
  load(state?: IBasePositionsState) {
    if (state?.pos) this._pos = state.pos;
    if (state?.numDimensions) this._numDimensions = state.numDimensions;
    if (state?.edgeWrap) this._edgeWrap = state.edgeWrap;
  }

  /**
   * Save positions to state.
   * @return positions state
   */
  save(): IBasePositionsState {
    return {
      edgeWrap: this._edgeWrap,
      numDimensions: this._numDimensions,
      pos: this._pos,
    };
  }
}
