// gridPositions.ts

import { range, round } from "@/utils";

import { BasePositions, type IBasePositionsState } from "./basePositions";
// import type { NESTNodeSpatial } from "./nodeSpatial";

export interface IGridPositionsState extends IBasePositionsState {
  center?: number[];
  extent?: number[];
  shape?: number[];
}

export class GridPositions extends BasePositions {
  public readonly name: string = "grid";

  private _extent: number[] = [1, 1];
  private _center: number[] = [0, 0];
  private _shape: number[] = [1, 1];

  // constructor(spatial: NESTNodeSpatial) {
  //   super(spatial);
  // }

  override get center(): number[] {
    return this._center;
  }

  set center(value: number[]) {
    this._center = value;
  }

  /**
   * Generate the Python code for grid positions, i.e. non-free positions.
   */
  override get code(): string {
    return `nest.spatial.grid(${JSON.stringify(this._shape)})\n`;
  }

  get extent(): number[] {
    return this._extent;
  }

  set extent(value: number[]) {
    this._extent = value;
  }

  override set numDimensions(value: number) {
    this._numDimensions = value;
    this.center = new Array(value).fill(0);
    this.extent = new Array(value).fill(1);
    this.shape = new Array(value).fill(1);
  }

  override get shape(): number[] {
    return this._shape;
  }

  set shape(values: number[]) {
    this._shape = values;
  }

  override generate(): void {
    const minX: number = this._center[0] - this.extent[0] / 2;
    const maxX: number = this._center[0] + this.extent[0] / 2;
    const minY: number = this._center[1] - this.extent[1] / 2;
    const maxY: number = this._center[1] + this.extent[1] / 2;
    const X: number[] = this.range(minX, maxX, this._shape[0]);
    const Y: number[] = this.range(minY, maxY, this._shape[1]);

    this.pos = [];
    X.forEach((x: number) => {
      Y.forEach((y: number) => {
        this.pos.push([round(x), round(y)]);
      });
    });
  }

  /**
   * Load grid positions from state.
   * @param state grid positions state
   */
  override load(state?: IGridPositionsState) {
    if (state?.numDimensions) this.numDimensions = state.numDimensions;
    if (state?.center) this.center = state.center;
    if (state?.extent) this.extent = state.extent;
    if (state?.shape) this.shape = state.shape;
  }

  range(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    const rangeData: number[] = range(min, max, step);
    return rangeData.filter((_: number, i: number) => i % 2 === 1);
  }

  /**
   * Save grid positions to state.
   * @return grid positions state
   */
  override save(): IGridPositionsState {
    return {
      center: this._center,
      edgeWrap: this.edgeWrap,
      extent: this.extent,
      numDimensions: this.numDimensions,
      shape: this._shape,
    };
  }
}
