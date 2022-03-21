import * as d3 from 'd3';

import { Connection } from '../connection';
import { NetworkGraph } from '../../network/networkGraph/networkGraph';
import { Parameter } from '../../parameter/parameter';
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
      .on('mouseover', (_, c: Connection) => {
        connection.state.focus();
        // Draw line between selected node and focused connection.
        if (
          c.network.state.isWeightRecorderSelected &&
          this.state.enableConnection
        ) {
          this._networkGraph.workspace.dragline.drawLine(
            c.network.state.selectedNode,
            c
          );
        }
        this._networkGraph.update();
      })
      .on('mouseout', () => {
        this._networkGraph.network.state.resetFocus();
        this._networkGraph.update();
      })
      .on('click', () => {
        const networkState = this._networkGraph.network.state;
        const workspaceState = this._networkGraph.workspace.state;
        connection.state.focus();

        if (
          networkState.isWeightRecorderSelected &&
          workspaceState.enableConnection
        ) {
          // Set cursor position of the focused connection.
          this._networkGraph.workspace.updateCursorPosition(
            connection.view.position
          );

          this._networkGraph.workspace.animationOff();

          const modelCopied = this._networkGraph.network.copyModel(
            connection.synapse.modelId
          );
          const WeightRecorderParam = modelCopied.params.find(
            (param: Parameter) => param.id === 'weight_recorder'
          );
          if (WeightRecorderParam) {
            WeightRecorderParam.value = networkState.selectedNode.view.label;
          }
          connection.synapse.modelId = modelCopied.new;
          connection.synapse.hideAllParams();
          connection.synapse.synapseChanges();

          networkState.selectedNode.view.color = connection.source.view.color;
          networkState.selectedNode.updateRecordsColor();

          this._networkGraph.workspace.reset();
          networkState.resetSelection();
          this._networkGraph.workspace.update();
        } else {
          connection.state.select();
        }

        this._networkGraph.update();
        this._networkGraph.workspace.updateTransform();
      });
  }

  /**
   * Update connections in network graph.
   *
   * @remarks
   * This function should be called when connections in the network are changed.
   */
  update(): void {
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
      .attr('hash', (c: Connection) => c.shortHash)
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
      this._networkGraph.network.cleanRecorders();
      this._networkGraph.render();
    }
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    const selector = d3.select('g#connections').selectAll('g.connection');
    selector.style('pointer-events', () =>
      this._networkGraph.network.state.isWeightRecorderSelected ||
      !this._networkGraph.workspace.state.enableConnection
        ? ''
        : 'none'
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
          this.strokeWidth * (connection.state.isFocused ? 1.2 : 1)
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
