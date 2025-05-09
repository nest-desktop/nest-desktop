// freePositions.ts

// @ts-expect-error Mustache has no default export.
import Mustache from "mustache";

import { round } from "@/utils/converter";
import { randomUniformFloat } from "@/utils/random";

import { BasePositions, IBasePositionsProps } from "./basePositions";
import { NESTNodeSpatial } from "./nodeSpatial";

export class FreePositions extends BasePositions {
  // private readonly _name: string = "free";
  private _codeTemplate: string =
    "{{ #posExisted }}{{ posAsString }}{{ /posExisted }}{{ ^posExisted }}nest.spatial.free(\n\t\tnest.random.uniform({{ min }}, {{ max }}),\n\t\tnum_dimensions={{ numDimensions }}\n\t)\n{{ /posExisted }}";

  constructor(spatial: NESTNodeSpatial, positionProps?: IBasePositionsProps) {
    super(spatial, positionProps);
  }

  /**
   * Generate the Python code for free (i.e. non-grid) positions.
   */
  override get code(): string {
    return Mustache.render(this._codeTemplate, this);
  }

  get min(): number {
    return -0.5;
  }

  get max(): number {
    return 0.5;
  }

  // get name(): string {
  //   return this._name;
  // }

  /**
   * Generate positions.
   */
  override generate(): void {
    this.pos = Array.from({ length: this.spatial.node.size }, () => {
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
