// freePositions.ts

import { randomUniformFloat } from "@/helpers/common/random";
import { round } from "@/utils/converter";

import { NESTNodeSpatial } from "./nodeSpatial";
import { BasePositions, BasePositionsProps } from "./basePositions";

export interface FreePositionsProps extends BasePositionsProps {}

export class FreePositions extends BasePositions {
  private readonly _name: string = "free";

  constructor(spatial: NESTNodeSpatial, positionProps?: FreePositionsProps) {
    super(spatial, positionProps);
  }

  get name(): string {
    return this._name;
  }

  /**
   * Generate positions.
   */
  override generate(): void {
    const minX: number = (-1 * this.extent[0]) / 2;
    const maxX: number = this.extent[0] / 2;
    const minY: number = (-1 * this.extent[1]) / 2;
    const maxY: number = this.extent[1] / 2;
    const minZ: number = (-1 * this.extent[2]) / 2;
    const maxZ: number = this.extent[2] / 2;

    this.pos = Array.from({ length: this.spatial.node.size }, () => {
      const x: number = randomUniformFloat(minX, maxX);
      const y: number = randomUniformFloat(minY, maxY);
      const pos: number[] = [round(x), round(y)];
      if (this.numDimensions === 3) {
        const z: number = randomUniformFloat(minZ, maxZ);
        pos.push(round(z));
      }
      return pos;
    });
  }
}
