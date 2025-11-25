// freePositions.ts

import { round } from "@/utils/converter";
import { randomUniformFloat } from "@/utils/random";

import { BasePositions } from "./basePositions";
// import type { NESTNodeSpatial } from "./nodeSpatial";

export class FreePositions extends BasePositions {
  public readonly name: string = "free";

  // constructor(spatial: NESTNodeSpatial) {
  //   super(spatial);
  // }

  get min(): number {
    return -0.5;
  }

  get max(): number {
    return 0.5;
  }

  /**
   * Generate positions.
   */
  override generate(): void {
    this.pos = Array.from({ length: this.spatial.node.size.value }, () => {
      const x: number = randomUniformFloat(this.min, this.max);
      const y: number = randomUniformFloat(this.min, this.max);
      if (this.numDimensions === 3) {
        const z: number = randomUniformFloat(this.min, this.max);
        return [round(x), round(y), round(z)];
      } else {
        return [round(x), round(y)];
      }
    });
  }
}
