// nodeSpatial.ts

import { BaseObj, type IBaseState } from "@/helpers/common/base";

import { FreePositions } from "./freePositions";
import { GridPositions, type IGridPositionsState } from "./gridPositions";
import type { IBasePositionsState } from "./basePositions";
import type { NESTNode } from "../node";

export interface INESTNodeSpatialState extends IBaseState {
  positions?: string;
  specs?: IBasePositionsState | IGridPositionsState;
}

export class NESTNodeSpatial extends BaseObj<INESTNodeSpatialState> {
  private _node: NESTNode;
  private _positions: FreePositions | GridPositions | undefined;

  constructor(node: NESTNode) {
    super({
      config: { name: "NESTNodeSpatial", simulator: "nest" },
    });

    this._node = node;
  }

  get code(): string {
    return this.positions ? this.positions.code : "";
  }

  get hasGridPositions(): boolean {
    return this._positions?.name === "grid";
  }

  /**
   * Check if it has positions (free or grid) component.
   */
  get hasPositions(): boolean {
    return this._positions != undefined;
  }

  get node(): NESTNode {
    return this._node;
  }

  get positions(): FreePositions | GridPositions | undefined {
    return this._positions;
  }

  changes(): void {
    this._node.changes();
  }

  /**
   * Load spatial node from state.
   * @param state spatial node state
   */
  load(state: INESTNodeSpatialState): void {
    switch (state.positions) {
      case "free":
        this._positions = new FreePositions(this);
        break;
      case "grid":
        this._positions = new GridPositions(this);
        break;
      default:
        this._positions = undefined;
        break;
    }

    this.positions?.load(state.specs);
  }

  /**
   * Save spatial node to state.
   * @return spatial node state
   */
  override save(): INESTNodeSpatialState {
    const state: INESTNodeSpatialState = {};
    if (this.positions) {
      state.positions = this.positions.name;
      state.specs = this.positions.save();
    }
    return state;
  }

  updatePositionParams(positionState: IBasePositionsState | IGridPositionsState): void {
    this._positions?.load(positionState);
  }
}
