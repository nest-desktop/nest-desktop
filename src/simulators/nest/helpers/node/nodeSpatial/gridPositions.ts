// gridPositions.ts

import { range } from "@/helpers/common/array";
import { round } from "@/utils/converter";

import { NESTNodeSpatial } from "./nodeSpatial";
import { BasePositions, IBasePositionsProps } from "./basePositions";

export interface IGridPositionsProps extends IBasePositionsProps {
  center?: number[];
  shape?: number[];
}

export class GridPositions extends BasePositions {
  private readonly _name: string = "grid";
  private _extent: number[] = [1, 1];
  private _center: number[] = [0, 0];
  private _shape: number[] = [1, 1];

  constructor(spatial: NESTNodeSpatial, positionProps?: IGridPositionsProps) {
    super(spatial, positionProps);

    if (positionProps) {
      this._extent =
        positionProps.extent || new Array(this._numDimensions).fill(1);
      this._center =
        positionProps.center || new Array(this.numDimensions).fill(0);
      this._shape =
        positionProps.shape || new Array(this.numDimensions).fill(1);
    }
  }

  override get center(): number[] {
    return this._center;
  }

  set center(value: number[]) {
    this._center = value;
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

  range(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    const rangeData: number[] = range(min, max, step);
    return rangeData.filter((_: number, i: number) => i % 2 === 1);
  }

  /**
   * Generate the Python code for grid positions, i.e. non-free positions.
   */
  override toPythonCode(): string {
    return `nest.spatial.grid(${JSON.stringify(this._shape)})\n`;
  }

  /**
   * Serialize for JSON.
   * @return grid positions props
   */
  override toJSON(): IGridPositionsProps {
    return {
      center: this._center,
      edgeWrap: this.edgeWrap,
      extent: this.extent,
      numDimensions: this.numDimensions,
      shape: this._shape,
    };
  }
}
