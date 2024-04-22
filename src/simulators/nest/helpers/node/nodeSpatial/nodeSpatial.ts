// nodeSpatial.ts

import { BaseObj } from "@/helpers/common/base";

import { FreePositions, FreePositionsProps } from "./freePositions";
import { GridPositions, GridPositionsProps } from "./gridPositions";
import { NESTNode } from "../node";

export interface INESTNodeSpatialProps {
  positions?: string;
  specs?: FreePositionsProps | GridPositionsProps;
}

export class NESTNodeSpatial extends BaseObj {
  private _node: NESTNode;
  private _positions: FreePositions | GridPositions | undefined;

  constructor(node: NESTNode, nodeSpatialProps?: INESTNodeSpatialProps) {
    super({
      config: { name: "NESTNodeSpatial", simulator: "nest" },
      logger: { settings: { minLevel: 3 } },
    });
    this._node = node;

    if (nodeSpatialProps) {
      this.init(nodeSpatialProps);
    }
  }

  get code(): string {
    // return this.positions ? this.positions.toPythonCode() : '';
    return "";
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

  /**
   * Initialize spatial node.
   */
  init(nodeSpatialProps: INESTNodeSpatialProps): void {
    switch (nodeSpatialProps.positions) {
      case "free":
        this._positions = new FreePositions(this, nodeSpatialProps.specs);
        break;
      case "grid":
        this._positions = new GridPositions(this, nodeSpatialProps.specs);
        break;
    }
  }

  /**
   * Serialize for JSON.
   * @return spatial object
   */
  toJSON(): INESTNodeSpatialProps {
    const nodeSpatialProps: INESTNodeSpatialProps = {};
    if (this._positions != undefined) {
      nodeSpatialProps.positions = this._positions.name;
      nodeSpatialProps.specs = this._positions.toJSON();
    }
    return nodeSpatialProps;
  }

  /**
   * Update hash of the spatial node.
   */
  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
