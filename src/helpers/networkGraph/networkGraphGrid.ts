// networkGraphGrid.ts

import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { TSelection } from "@/types";

interface INetworkGraphGridData {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
export class NetworkGraphGrid {
  private _workspace: NetworkGraphWorkspace;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    this._workspace = networkGraphWorkspace;
  }

  get height(): number {
    return this._workspace.size.height;
  }

  get width(): number {
    return this._workspace.size.width;
  }

  /**
   * Get data for grid graph.
   */
  data(): INetworkGraphGridData[] {
    const data = [];
    const offset = 10;
    const cellHeight = 25;
    const cellWidth = 25;
    const nRows = (this.height / cellHeight) * 3;
    const nColumns = (this.width / cellWidth) * 3;

    // Iterate for rows.
    for (let row = 0; row < nRows - 1; row++) {
      data.push({
        x1: -this.width,
        x2: this.width * 2,
        y1: offset + row * cellHeight - this.height,
        y2: offset + row * cellHeight - this.height,
      });
    }

    // Iterate for columns.
    for (let column = 0; column < nColumns - 1; column++) {
      data.push({
        x1: offset + column * cellWidth - this.width,
        x2: offset + column * cellWidth - this.width,
        y1: -this.height,
        y2: this.height * 2,
      });
    }
    return data;
  }

  /**
   * Update grid graph.
   */
  update(): void {
    const gridLines: TSelection = this._workspace.selector.selectAll(".grid").selectAll(".gridLine").data(this.data());

    gridLines
      .enter()
      .append("line")
      .attr("class", "gridLine")
      .attr("stroke", "rgba(128,128,128,0.12)")
      .style("pointer-events", "none")
      .merge(gridLines)
      .attr("x1", (d: INetworkGraphGridData) => d.x1)
      .attr("x2", (d: INetworkGraphGridData) => d.x2)
      .attr("y1", (d: INetworkGraphGridData) => d.y1)
      .attr("y2", (d: INetworkGraphGridData) => d.y2)
      .style("opacity", this._workspace.state.showGrid ? 1 : 0);

    gridLines.exit().remove();
  }
}
