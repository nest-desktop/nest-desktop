// nestNodeSpatial.ts

import { sha1 } from "object-hash";

import { Config } from "@/helpers/common/config";

import { FreePositions, FreePositionsProps } from "./freePositions";
import { GridPositions, GridPositionsProps } from "./gridPositions";
import { NESTNode } from "../nestNode";

export interface NESTNodeSpatialProps {
  positions?: string;
  specs?: FreePositionsProps | GridPositionsProps;
}

export class NESTNodeSpatial extends Config {
  private _hash: string = "";
  private _node: NESTNode;
  private _positions: FreePositions | GridPositions | undefined;

  constructor(node: NESTNode, spatial?: NESTNodeSpatialProps) {
    super("NESTNodeSpatial");
    this._node = node;

    if (spatial) {
      this.init(spatial);
    }
  }

  get code(): string {
    // return this.positions ? this.positions.toPythonCode() : '';
    return "";
  }

  get hasGridPositions(): boolean {
    return this._positions?.name === 'grid';
  }

  get hash(): string {
    return this._hash;
  }

  get node(): NESTNode {
    return this._node;
  }

  // get positions(): FreePositions | GridPositions | undefined {
  //   return this._positions;
  // }

  /**
   * Update hash of the spatial node.
   */
  updateHash(): void {
    this._hash = sha1(JSON.stringify(this.toJSON()));
  }

  /**
   * Initialize spatial node.
   */
  init(spatial: NESTNodeSpatialProps): void {
    switch (spatial.positions) {
      case "free":
        this._positions = new FreePositions(this, spatial.specs);
        break;
      case "grid":
        this._positions = new GridPositions(this, spatial.specs);
        break;
    }
  }

  /**
   * Check if it has positions (free or grid) component.
   */
  get hasPositions(): boolean {
    return this._positions != undefined;
  }

  /**
   * Serialize for JSON.
   * @return spatial object
   */
  toJSON(): NESTNodeSpatialProps {
    const spatial: NESTNodeSpatialProps = {};
    if (this._positions != undefined) {
      spatial.positions = this._positions.name;
      spatial.specs = this._positions.toJSON();
    }
    return spatial;
  }
}
