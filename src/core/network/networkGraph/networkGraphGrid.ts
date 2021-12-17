import * as d3 from 'd3';

import { NetworkGraphWorkspace } from './networkGraphWorkspace';

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
  data() {
    const data = new Array();
    const offset = 10;
    const cellHeight = 25;
    const cellWidth = 25;
    const nrows = (this.height / cellHeight) * 3;
    const ncolumns = (this.width / cellWidth) * 3;

    // iterate for rows
    for (let row = 0; row < nrows - 1; row++) {
      data.push({
        x1: -this.width,
        x2: this.width * 2,
        y1: offset + row * cellHeight - this.height,
        y2: offset + row * cellHeight - this.height,
      });
    }

    // iterate for columns
    for (let column = 0; column < ncolumns - 1; column++) {
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
  update() {
    const gridLines: d3.Selection<any, any, any, any> = this._workspace.selector
      .selectAll('.grid')
      .selectAll('.gridLine')
      .data(this.data());

    gridLines
      .enter()
      .append('line')
      .attr('class', 'gridLine')
      .attr('stroke', 'rgba(128,128,128,0.12)')
      .style('pointer-events', 'none')
      .merge(gridLines)
      .attr('x1', (d: any) => d.x1)
      .attr('x2', (d: any) => d.x2)
      .attr('y1', (d: any) => d.y1)
      .attr('y2', (d: any) => d.y2)
      .style('opacity', this._workspace.state.showGrid ? 1 : 0);

    gridLines.exit().remove();
  }
}
