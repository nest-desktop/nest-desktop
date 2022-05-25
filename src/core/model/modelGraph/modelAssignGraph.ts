import * as d3 from 'd3';

import { Connection } from '../../connection/connection';
import { CopyModel } from '../../model/copyModel';
import { NetworkGraph } from '../../network/networkGraph/networkGraph';
import { Node } from '../../node/node';
import drawPath from '../../connection/connectionGraph/connectionGraphPath';

export class ModelAssignGraph {
  private _networkGraph: NetworkGraph;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get state(): any {
    return this._networkGraph.workspace.state;
  }

  get strokeWidth(): number {
    return this._networkGraph.config.strokeWidth;
  }

  /**
   * Initialize a connection graph.
   */
  init(
    connection: Connection,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    const elem: d3.Selection<any, any, any, any> = d3.select(elements[idx]);

    elem.selectAll('*').remove();

    elem
      .append('path')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('opacity', 0)
      .style('stroke-width', 40);

    elem
      .append('path')
      .attr('class', 'color')
      .attr('marker-end', `url(#assigned${connection.idx})`)
      .style('fill', 'none')
      .style('pointer-events', 'none')
      .style('stroke-width', this.strokeWidth);

    elem
      .on('mouseover', () => {
        connection.state.focus();
        this._networkGraph.update();
      })
      .on('mouseout', () => {
        this._networkGraph.network.state.resetFocus();
        this._networkGraph.update();
      });
  }

  /**
   * Update connections in network graph.
   *
   * @remarks
   * This function should be called when connections in the network are changed.
   */
  update(): void {
    const models: d3.Selection<any, any, any, any> = this._networkGraph.selector
      .select('g#modelAssigned')
      .selectAll('g.modelAssigned')
      .data(
        this._networkGraph.network.connectionsRecordedByWeightRecorder,
        (c: Connection) => c.hash
      );

    models
      .enter()
      .append('g')
      .attr('class', 'modelAssigned')
      .attr('idx', (c: Connection) => c.idx)
      .attr('hash', (c: Connection) => c.shortHash)
      .each((c: Connection, i: number, e) => this.init(c, i, e));

    models.exit().remove();

    this.render();
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    const selector = d3.select('g#modelAssigned').selectAll('g.modelAssigned');
    selector.style('pointer-events', 'none');

    selector.each((connection: Connection, idx: number, elements: any[]) => {
      const elem = d3.select(elements[idx]);
      const synapseModel = connection.synapse.model as CopyModel;
      const weightRecorder = synapseModel.weightRecorder as Node;

      if (weightRecorder) {
        elem
          .selectAll('path')
          .attr(
            'd',
            drawPath(
              weightRecorder.view.position,
              connection.view.targetPosition,
              {
                isTargetMouse: true,
              }
            )
          )
          .style('stroke-dasharray', 3);
        elem.select('path.color').style('stroke', weightRecorder.view.color);
      }
    });
  }
}
