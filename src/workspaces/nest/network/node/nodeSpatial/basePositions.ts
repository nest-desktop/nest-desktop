// basePositions.ts

import { CodeNodeMask } from "@/codeGraph";

import { NESTNodeSpatial } from "./nodeSpatial";

export interface IBasePositionsState {
  edgeWrap?: boolean;
  numDimensions?: number;
  pos?: number[][];
}

export class BasePositions extends CodeNodeMask {
  private _edgeWrap: boolean = false;
  public _numDimensions: number = 2;
  private _pos: number[][] = [];
  private _spatial: NESTNodeSpatial;

  constructor(spatial: NESTNodeSpatial) {
    super();

    this._spatial = spatial;
  }

  get center(): number[] {
    return [];
  }

  get edgeWrap(): boolean {
    return this.intf?.edge_wrap ?? this._edgeWrap;
  }

  set edgeWrap(value: boolean) {
    this._edgeWrap = value;
    if (this.intf) this.intf.edge_wrap.value = value;
  }

  get extent(): number[] {
    return [];
  }

  get numDimensions(): number {
    return this.intf?.num_dimensions.value ?? this._numDimensions;
  }

  set numDimensions(value: number) {
    this._numDimensions = value;
    if (this.intf && this.intf.num_dimensions) this.intf.num_dimensions.value = value;
  }

  get pos(): number[][] {
    return this._pos;
  }

  set pos(value: number[][]) {
    this._pos = value;
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
   * Load positions from state
   * @param state positions state
   */
  load(state: IBasePositionsState = {}) {
    if (state.edgeWrap) this.edgeWrap = state.edgeWrap;
    if (state.numDimensions) this.numDimensions = state.numDimensions;
    if (state.pos) this.pos = state.pos;
  }

  /**
   * Save positions to state.
   * @return positions state
   */
  override save(): IBasePositionsState {
    return {
      edgeWrap: this.edgeWrap,
      numDimensions: this.numDimensions,
      pos: this.pos,
    };
  }
}
