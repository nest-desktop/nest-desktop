import * as d3 from 'd3';

import { NetworkGraph } from '../../network/networkGraph/networkGraph';
import { Node } from '../node';

function anglePoint(deg: number, radius: number, y0: number = 0): number[] {
  const radian: number = (deg / 180) * Math.PI;
  return [Math.cos(radian) * radius, y0 - Math.sin(radian) * radius];
}

function getHexagonPoints(radius: number): string {
  const a: number = radius * 1.1;
  const p0: number[] = anglePoint(0, a, 4);
  const p1: number[] = anglePoint(60, a, 4);
  const p2: number[] = anglePoint(120, a, 4);
  const p3: number[] = anglePoint(180, a, 4);
  const p4: number[] = anglePoint(240, a, 4);
  const p5: number[] = anglePoint(300, a, 4);
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(','),
    p3.join(','),
    p4.join(','),
    p5.join(','),
  ].join(',');
  return points;
}

function getRectanglePoints(radius: number): string {
  const r: number = radius * Math.sqrt(Math.PI / 2);
  const deg = 8;
  const b = 10;
  const y0 = Math.PI;
  const p0: number[] = anglePoint(45 - deg, r, y0);
  const p1: number[] = anglePoint(135 + deg, r, y0);
  const p2: number[] = anglePoint(225 - deg, r, y0);
  const p3: number[] = anglePoint(315 + deg, r, y0);
  const points: string = [
    [p0[0] + b, p0[1]].join(','),
    [p1[0] + b, p1[1]].join(','),
    [p2[0] - b, p2[1]].join(','),
    [p3[0] - b, p3[1]].join(','),
  ].join(',');
  return points;
}

function getSquarePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(45, a, 4);
  const p1: number[] = anglePoint(135, a, 4);
  const p2: number[] = anglePoint(225, a, 4);
  const p3: number[] = anglePoint(315, a, 4);
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(','),
    p3.join(','),
  ].join(',');
  return points;
}

function getTrianglePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(90, a, 4);
  const p1: number[] = anglePoint(210, a, 4);
  const p2: number[] = anglePoint(330, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [p0.join(','), p1.join(','), p2.join(',')].join(',');
  return points;
}

function nodePoints(node: Node, radius: number): string {
  if (node.model.isStimulator) {
    return getHexagonPoints(radius);
  } else if (node.model.isRecorder) {
    return getRectanglePoints(radius);
  } else if (node.isExcitatoryNeuron) {
    return getTrianglePoints(radius);
  } else {
    return getSquarePoints(radius);
  }
}

export class NodeGraphShape {
  private _networkGraph: NetworkGraph;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get darkMode(): boolean {
    return this._networkGraph.network
      ? this._networkGraph.network.project.app.darkMode
      : false;
  }

  get nodeRadius(): number {
    return this._networkGraph.config.nodeRadius;
  }

  get strokeWidth(): number {
    return this._networkGraph.config.strokeWidth;
  }

  drawShape(selector: d3.Selection<any, any, any, any>, node: Node): void {
    selector.attr('elementType', node.model.elementType);
    selector.attr('weight', node.view.weight);

    const elem = selector.select('.core');
    elem.selectAll('*').remove();

    if (node.isInhibitoryNeuron) {
      elem.append('circle').attr('class', 'shape').attr('r', this.nodeRadius);
    } else {
      elem
        .append('polygon')
        .attr('class', 'shape')
        .attr('points', (n: Node) => nodePoints(n, this.nodeRadius));
    }

    elem.append('text');
  }

  /**
   * Initialize a node shape.
   */
  init(selector: d3.Selection<any, any, any, any>, node: Node): void {
    const elem: d3.Selection<any, any, any, any> = selector
      .append('g')
      .attr('class', 'core');

    this.drawShape(selector, node);

    elem.on('click', (e: MouseEvent) => {
      const networkState = this._networkGraph.network.state;
      const workspaceState = this._networkGraph.workspace.state;
      node.state.focus();

      if (networkState.selectedNode && workspaceState.enableConnection) {
        // Set cursor position of the focused node.
        this._networkGraph.workspace.updateCursorPosition(node.view.position);

        this._networkGraph.workspace.animationOff();
        this._networkGraph.network.connectNodes(
          networkState.selectedNode,
          node
        );

        if (!this._networkGraph.workspace.altPressed) {
          this._networkGraph.workspace.reset();
          networkState.resetSelection();
          this._networkGraph.workspace.update();
        }
      } else if (this._networkGraph.workspace.altPressed) {
        node.state.select(true);
        this._networkGraph.workspace.reset();
        this._networkGraph.workspace.dragline.init(e);
      } else {
        node.state.select();
      }

      this._networkGraph.update();
      this._networkGraph.workspace.updateTransform();
    });

    elem.transition().style('opacity', 1);
  }

  /**
   * Render all node shapes.
   */
  render(): void {
    const nodes = d3.select('g#nodes').selectAll('g.node');
    nodes.style('pointer-events', () =>
      this._networkGraph.network.state.isNodeSourceSelected ||
      !this._networkGraph.workspace.state.enableConnection
        ? ''
        : 'none'
    );

    // Check if neuron has to change its shape.
    nodes.each((node: Node, idx: number, elements: any[]) => {
      const elem = d3.select(elements[idx]);

      if (
        elem.attr('elementType') !== node.model.elementType ||
        elem.attr('weight') !== node.view.weight
      ) {
        this.drawShape(elem, node);
      }

      elem
        .select('.shape')
        .style('stroke', node.view.color)
        .style('fill', this.darkMode ? '#121212' : 'white')
        .style(
          'stroke-width',
          (node.size > 1 ? 1.5 : 1) * this._networkGraph.config.strokeWidth
        )
        .style('stroke-dasharray', node.state.isSelected ? '7.85' : '');

      elem
        .select('text')
        .attr('dy', node.isInhibitoryNeuron ? '0.4em' : '0.7em')
        .style('fill', this.darkMode ? 'white' : '#121212')
        .style('font-family', 'Roboto')
        .style('text-anchor', 'middle')
        .text(node.view.label);
    });
  }
}
