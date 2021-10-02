import * as d3 from 'd3';

import { Connection } from './connection';
import { NetworkGraph } from '../network/networkGraph';
import drawPath from './connectionGraphPath';

export class ConnectionGraph {
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
    // console.log('Init connection graph');
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
      .style('fill', 'none')
      .style('stroke-width', this.strokeWidth)
      .style('pointer-events', 'none');

    elem
      .on('mouseover', () => {
        connection.view.focus();
        this._networkGraph.update();
      })
      .on('mouseout', () => {
        this._networkGraph.network.view.resetFocus();
        this._networkGraph.update();
      })
      .on('click', () => {
        connection.view.focus();
        this._networkGraph.network.view.selectedConnection = connection;
        this._networkGraph.update();
      });
  }

  /**
   * Update connections in network graph.
   *
   * @remarks
   * This function should be called when connections in network are changed.
   */
  update() {
    // console.log('Init network graph');
    const connections: d3.Selection<any, any, any, any> =
      this._networkGraph.selector
        .select('g#connections')
        .selectAll('g.connection')
        .data(
          this._networkGraph.network.connections,
          (c: Connection) => c.hash
        );

    connections
      .enter()
      .append('g')
      .attr('class', 'connection')
      .attr('idx', (c: Connection) => c.idx)
      .attr('hash', (c: Connection) => c.hash.slice(0, 6))
      .style('opacity', 0)
      .call(
        d3
          .drag()
          .on('start', (e: MouseEvent) => this._networkGraph.dragStart(e))
          .on('drag', (e: MouseEvent, c: Connection) => this.drag(e, c))
          .on('end', (e: MouseEvent) => this._networkGraph.dragEnd(e))
      )
      .each((c: Connection, i: number, e) => this.init(c, i, e));

    connections.exit().remove();

    this.render();
  }

  /**
   * Drag connection graph by moving its node graphs.
   */
  drag(event: MouseEvent, connection: Connection): void {
    if (!this.state.enableConnection) {
      const sourceNode = connection.source;
      sourceNode.view.position.x += event['dx'];
      sourceNode.view.position.y += event['dy'];
      const targetNode = connection.target;
      targetNode.view.position.x += event['dx'];
      targetNode.view.position.y += event['dy'];
      this._networkGraph.render();
    }
  }

  /**
   * Render connection graphs.
   */
  render() {
    // console.log('Render connection graph');
    const selector = d3.select('g#connections').selectAll('g.connection');

    selector.style('pointer-events', () =>
      this._networkGraph.workspace.state.enableConnection ? 'none' : ''
    );

    const duration: number = this._networkGraph.workspace.state.dragging
      ? 0
      : 250;
    const t: d3.Transition<any, any, any, any> = d3
      .transition()
      .duration(duration);

    selector.each((connection: Connection, idx: number, elements: any[]) => {
      const elem = d3.select(elements[idx]);

      elem
        .selectAll('path')
        .transition(t)
        .attr(
          'd',
          drawPath(
            connection.source.view.position,
            connection.target.view.position
          )
        );

      elem
        .select('path.color')
        .style('stroke', connection.source.view.color)
        .style(
          'stroke-width',
          this.strokeWidth * (connection.view.isFocused(false) ? 1.2 : 1)
        )
        .attr('marker-end', connection.view.markerEnd())
        .style(
          'stroke-dasharray',
          connection.view.probabilistic() ? '7.85' : ''
        );

      elem.transition(t).delay(duration).style('opacity', 1);
    });
  }
}
