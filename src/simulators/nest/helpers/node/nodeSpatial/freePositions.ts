// freePositions.ts

import mustache from "mustache";

import { randomUniformFloat } from "@/helpers/common/random";
import { round } from "@/utils/converter";

import { NESTNodeSpatial } from "./nodeSpatial";
import { BasePositions, IBasePositionsProps } from "./basePositions";

export interface IFreePositionsProps extends IBasePositionsProps {}

export class FreePositions extends BasePositions {
  private readonly _name: string = "free";
  private _codeTemplate: string = "";

  constructor(spatial: NESTNodeSpatial, positionProps?: IFreePositionsProps) {
    super(spatial, positionProps);

    import("./templates/freePositions.mustache?raw").then(
      (template: { default: string }) => {
        this._codeTemplate = template.default;
      }
    );
  }

  get min(): number {
    return 0;
  }

  get max(): number {
    return 1;
  }

  get name(): string {
    return this._name;
  }

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

  /**
   * Generate the Python code for free (i.e. non-grid) positions.
   */
  override toPythonCode(): string {
    return mustache.render(this._codeTemplate, this);
  }
}
