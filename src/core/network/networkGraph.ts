import * as d3 from 'd3';

import { Connection } from '../connection/connection';
import { drawPath } from '../connection/connectionGraph';
import { Network } from './network';
import { getPoints } from '../node/nodeGraph';
import { Node } from '../node/node';

export class NetworkGraph {
  private _cursorPosition: any = { x: 0, y: 0 };
  private _height: number = 600;
  private _network: Network;
  private _networkCenter: any = { x: 0, y: 0 };
  private _nodeRadius: number = 20;
  private _selector: d3.Selection<any, any, any, any>;
  private _state: any = {
    centerFocus: true,
    dragging: false,
    enableConnection: false,
    keyCode: null,
    resizing: false,
  };
  private _strokeWidth: number = 3;
  private _width: number = 800;
  private _zoom: any;
  private _transform: any = { k: 1, x: 0, y: 0 };

  constructor(selector: string) {
    this._selector = d3.select(selector);
    this.init();
  }

  get centerFocus(): boolean {
    return this._state.centerFocus;
  }

  get network(): Network {
    return this._network;
  }

  set network(value: Network) {
    this._network = value;
  }

  get state(): any {
    return this._state;
  }

  get strokeWidth(): number {
    return this._strokeWidth;
  }

  get transform(): any {
    return this._transform;
  }

  /**
   * Draw node.
   */
  drawNode(node: Node, elem: d3.Selection<any, any, any, any>): void {
    if (
      node.model.elementType == 'neuron' &&
      node.view.weight == 'inhibitory'
    ) {
      elem
        .append('circle')
        .attr('class', 'shape')
        .attr('r', this._nodeRadius);
    } else {
      elem
        .append('polygon')
        .attr('class', 'shape')
        .attr('points', getPoints(node, this._nodeRadius));
    }

    elem
      .selectAll('.shape')
      .style('stroke', node.view.color)
      .style('stroke-width', this._strokeWidth);

    elem
      .append('text')
      .attr('dy', () =>
        node.model.elementType == 'neuron' && node.view.weight == 'inhibitory'
          ? '0.4em'
          : '0.7em'
      )
      .text(() => node.view.label);

    elem.on('mouseover', () => {
      this._network.view.focusedNode = node;
      if (this._network.view.selectedNode && this._state.enableConnection) {
        this.drawLineNodes(this._network.view.selectedNode, node);
      }
      this.updateNetworkGraph();
    });

    elem.on('mouseout', () => {
      this._network.view.resetFocus();
      this.updateNetworkGraph();
    });

    elem.on('click', () => {
      if (this._network.view.selectedNode && this._state.enableConnection) {
        this._network.connectNodes(this._network.view.selectedNode, node);
        this.reset();
        node.view.focus();
      } else if (this._network.view.selectedNode === node) {
        this.reset();
        node.view.focus();
      } else {
        this.reset();
        node.view.select();
        node.view.focus();
      }
      this.updateNetworkGraph();
      this.centerNetworkGraph();
      this.resize();
    });
  }

  /**
   * Initialize panel.
   */
  initPanel(): void {
    const selectPanel: d3.Selection<any, any, any, any> = this._selector.select(
      'g#panel'
    );
    selectPanel.style('display', 'none');
    selectPanel
      .append('circle')
      .attr('class', 'select')
      .attr('fill', 'white')
      .attr('fill-opacity', '0.8')
      .attr('r', this._nodeRadius - this._strokeWidth)
      .on('click', () => {
        this.reset();
      })
      .on('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        this.reset();
      });

    const arcFrame: d3.Arc<any, any> = d3
      .arc()
      .innerRadius(this._nodeRadius - this._strokeWidth)
      .outerRadius(this._nodeRadius * 2);

    const elementTypes: string[] = ['recorder', 'neuron', 'stimulator'];
    elementTypes.forEach((elementType: string, idx: number) => {
      const panel: d3.Selection<any, any, any, any> = selectPanel
        .append('g')
        .attr('class', 'select ' + elementType)
        .append('path')
        .datum({
          startAngle: (Math.PI * idx * 2) / 3,
          endAngle: (Math.PI * (idx + 1) * 2) / 3,
        })
        .style('fill', 'white')
        .attr('fill-opacity', '0.8')
        .style('cursor', 'pointer')
        .style('stroke', () => {
          return this._network
            ? this._network.view.getNodeColor(this._network.nodes.length)
            : 'grey';
        })
        .style('stroke-width', this._strokeWidth)
        .attr('d', arcFrame)
        .on('mouseover', () => {
          this._selector
            .select('g#panel')
            .select('g.tooltip')
            .style('visibility', 'visible')
            .select('text.label')
            .text(elementType);
          panel.style('fill', () => {
            return this._network
              ? this._network.view.getNodeColor(this._network.nodes.length)
              : 'grey';
          });
        })
        .on('mouseout', () => {
          this._selector
            .select('g#panel')
            .select('g.tooltip')
            .style('visibility', 'hidden')
            .select('text.label')
            .text('');
          panel.style('fill', 'white');
        })
        .on('mouseup', () => {
          this.reset();
          this._network.createNode({
            elementType,
            position: JSON.parse(JSON.stringify(this._cursorPosition)),
          });
          this.update();
        });

      const f: number = (idx * 2) / 3 + 1 / 3;
      selectPanel
        .append('text')
        .attr('class', 'select label')
        .style('font-size', '11px')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .attr('fill', 'black')
        .attr('dx', Math.sin(Math.PI * f) * 28)
        .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
        .text(elementType.slice(0, 1).toUpperCase());
    });

    selectPanel
      .append('g')
      .attr('class', 'tooltip')
      .attr('transform', 'translate(0, -45)')
      .style('visibility', 'hidden');

    selectPanel
      .select('g.tooltip')
      .append('rect')
      .attr('transform', 'translate(-37, -14)')
      .attr('width', '74px')
      .attr('height', '16px')
      .attr('fill', 'white');

    selectPanel
      .select('g.tooltip')
      .append('text')
      .attr('class', 'label')
      .style('text-anchor', 'middle');
  }

  /**
   * Reset line.
   */
  resetDragLine(): void {
    this._selector.selectAll('.dragline').style('opacity', 0);
  }

  /**
   * Draw line.
   */
  dragLine(e: MouseEvent): void {
    if (this._network.view.selectedNode !== null) {
      const selectedNode: Node = this._network.view.selectedNode;
      const source: any = selectedNode.view.position;
      const position: number[] = d3.pointer(
        e,
        this._selector.select('g#network').node()
      );
      const target: any = {
        x: position[0],
        y: position[1],
      };
      this._selector
        .selectAll('.dragline')
        .style('opacity', 0.5)
        .style('stroke', selectedNode.view.color)
        .attr('d', () => drawPath(source, target, { isTargetMouse: true }));
    } else {
      console.error('No node was selected when dragLine() got executed!');
    }
  }

  /**
   * Draw connection line between nodes
   */
  drawLineNodes(source: Node, target: Node) {
    this._selector
      .selectAll('.dragline')
      .style('opacity', 1)
      .attr('d', () => drawPath(source.view.position, target.view.position));
  }

  /**
   * Enable connection and draw line.
   */
  enableConnection(e: MouseEvent): void {
    this._state.enableConnection = true;
    this.updateNetworkGraph();
    this.dragLine(e);
  }

  /**
   * Initialize zoom handler
   */
  initZoom(): void {
    this._zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [this._width, this._height],
      ])
      .scaleExtent([0.5, 2])
      .on('zoom', ({ transform }) => {
        this._transform = transform;
        if (this._state.resizing) {
          this._selector
            .select('g#network')
            .transition()
            .attr('transform', transform);
        } else {
          this._selector.select('g#network').attr('transform', transform);
        }
      })
      .on('end', () => {
        // necessary to reset the cursor when dragging the background
        this._selector.select('rect#background').style('cursor', 'default');
        //document.getElementsByTagName('body')[0].style.cursor = 'move';
      });
  }

  /**
   * Initialize background.
   */
  initBackground(): void {
    this._selector
      .select('rect#background')
      .on('mousemove', (e: MouseEvent) => {
        this._network.view.resetFocus();
        if (this._state.enableConnection) {
          this.dragLine(e);
        }
      })
      .on('click', () => {
        if (this._state.enableConnection) {
          this.resetDragLine();
          this._state.enableConnection = false;
        } else {
          this.reset();
        }
        this.updateNetworkGraph();
      })
      .on('mousedown', () => {
        this._selector.select('rect#background').style('cursor', 'move');
        // Beware: Setting default with "on('mouseup', ...)" does not work,
        // therefore the resetting takes place in the zoom method ('end').
      })
      .on('contextmenu', (e: MouseEvent) => {
        // console.log(event);
        e.preventDefault();
        const position: number[] = d3.pointer(
          e,
          this._selector.select('g#network').node()
        );
        this._cursorPosition.x = position[0];
        this._cursorPosition.y = position[1];

        this._selector
          .select('g#panel')
          .selectAll('path')
          .style('stroke', () =>
            this._network.view.getNodeColor(this._network.nodes.length)
          );

        this._selector
          .select('g#panel')
          .style('display', 'block')
          .attr(
            'transform',
            () =>
              `translate(${this._cursorPosition.x},${this._cursorPosition.y})`
          )
          .style('opacity', '0.8');
      })
      .call(this._zoom);
  }

  /**
   * Initialize network graph.
   */
  initNetworkGraph() {
    // console.log('Init network graph');
    const connections: d3.Selection<any, any, any, any> = this._selector
      .select('g#connections')
      .selectAll('g.connection')
      .data(this._network.connections);

    const connectionGroup: d3.Selection<any, any, any, any> = connections
      .enter()
      .append('g')
      .attr('class', 'connection')
      .style('opacity', 0)
      .merge(connections);

    connectionGroup.selectAll('path').remove();

    connectionGroup
      .append('path')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('opacity', 0)
      .style('stroke-width', 40)
      .attr('d', (connection: Connection) => connection.view.drawPath())
      .merge(connections)
      .on('mouseover', (_, connection: Connection) => {
        connection.view.focus();
        this.updateNetworkGraph();
      })
      .on('mouseout', () => {
        this._network.view.resetFocus();
        this.updateNetworkGraph();
      })
      .on('click', (_, connection: Connection) => {
        if (this._network.view.selectedConnection === connection) {
          this.reset();
        } else {
          this.reset();
          connection.view.select();
        }
        connection.view.focus();
        this.updateNetworkGraph();
      });

    connectionGroup
      .append('path')
      .attr('class', 'display')
      .style('fill', 'none')
      .style('stroke-width', this._strokeWidth)
      .style('pointer-events', 'none')
      .attr('d', (connection: Connection) => connection.view.drawPath())
      .merge(connections);

    connections.exit().remove();

    const nodes: d3.Selection<any, any, any, any> = this._selector
      .select('g#nodes')
      .selectAll('g.node')
      .data(this._network.nodes);

    nodes
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('idx', (node: Node) => node.idx)
      .attr(
        'transform',
        (node: Node) =>
          `translate(${node.view.position.x},${node.view.position.y}) scale( ${
            node.view.isFocused() ? 1.2 : 1
          })`
      )
      .call(
        d3
          .drag()
          .on('start', (event: any) => {
            this._state.dragging = true;
            d3.select(event.sourceEvent.srcElement.parentNode).classed(
              'active',
              true
            );
            // .raise();
            d3.select(event.sourceEvent.srcElement).style('cursor', 'grabbing');
          })
          .on('drag', (event: MouseEvent, node: Node) => {
            node.view.position.x = event.x;
            node.view.position.y = event.y;
            this.updateNetworkGraph();
          })
          .on('end', (event: any) => {
            this._state.dragging = false;
            d3.select(event.sourceEvent.srcElement.parentNode).classed(
              'active',
              false
            );
            d3.select(event.sourceEvent.srcElement).style('cursor', 'pointer');
            // d3.selectAll("g.node").sort((a,b) => d3.ascending(a.idx, b.idx))
            this.centerNetworkGraph();
            this.resize();
          })
      )
      .style('opacity', 0)
      .merge(nodes)
      .each((node: Node, idx: number, elements: any[]) => {
        const elem: d3.Selection<any, any, any, any> = d3.select(elements[idx]);
        elem.selectAll('*').remove();
        this.drawNode(node, elem);
      });

    nodes.exit().remove();
  }

  /**
   * Update network graph.
   */
  updateNetworkGraph() {
    // console.log('Update network graph');
    const t: d3.Transition<any, any, any, any> = d3
      .transition()
      .duration(this._state.dragging ? 0 : 250);

    // update connection path
    this._selector
      .selectAll('g.connection')
      .transition(t)
      .style('opacity', 1);

    this._selector
      .selectAll('g.connection')
      .selectAll('path.display')
      .style('stroke', (connection: Connection) => connection.source.view.color)
      .style(
        'stroke-width',
        (connection: Connection) =>
          (connection.view.isFocused(false) ? 1.2 : 1) * this._strokeWidth
      )
      .attr('marker-end', (connection: Connection) =>
        connection.view.markerEnd()
      )
      .style('stroke-dasharray', (connection: Connection) =>
        connection.view.probabilistic() ? '7.85' : ''
      );

    this._selector
      .selectAll('g.connection')
      .selectAll('path')
      .attr('d', (connection: Connection) => connection.view.drawPath());

    // update node group
    this._selector
      .selectAll('g.node')
      .transition(t)
      .attr(
        'transform',
        (node: Node) =>
          `translate(${node.view.position.x},${node.view.position.y}) scale( ${
            node.view.isFocused() ? 1.2 : 1
          })`
      )
      .style('opacity', 1);

    // update node shape
    this._selector
      .selectAll('g.node')
      .selectAll('.shape')
      .style('stroke', (node: Node) => node.view.color)
      .style('stroke-dasharray', (node: Node) =>
        node.view.isSelected() ? '7.85' : ''
      );
  }

  /**
   * Centering network graph.
   */
  centerNetworkGraph(): void {
    // console.log('center network graph');
    const x: number[] = [];
    const y: number[] = [];
    this._network.nodes.forEach((node: Node) => {
      x.push(node.view.position.x);
      y.push(node.view.position.y);
    });
    this._networkCenter.x = (d3.min(x) + d3.max(x)) / 2;
    this._networkCenter.y = (d3.min(y) + d3.max(y)) / 2;
  }

  /**
   * Resize graph.
   */
  resize(width: number = 0, height: number = 0): void {
    this._state.resizing = true;
    this._width = width || this._width;
    this._height = height || this._height;
    this._selector.attr('width', this._width).attr('height', this._height);
    this._selector
      .select('rect#background')
      .attr('width', this._width)
      .attr('height', this._height);

    if (this._state.centerFocus) {
      const x = this._width / 2 - this._networkCenter.x;
      const y = this._height / 2 - this._networkCenter.y;
      this._selector
        .select('rect#background')
        .call(this._zoom.transform, d3.zoomIdentity.translate(x, y));
    }
    this._state.resizing = false;
  }

  /**
   * Toggle center focus of network graph.
   */
  toggleCenterFocus(): void {
    this._state.centerFocus = !this._state.centerFocus;
    this.centerNetworkGraph();
    this.resize();
  }

  /**
   * Initialize graph.
   */
  init(): void {
    // console.log('Init network graph');
    d3.select('body')
      .on('keyup', (event: any) => {
        this._state.keyCode = null;
        if (event.keyCode === 27) {
          this.reset();
          this.updateNetworkGraph();
        }
      })
      .on('keydown', (event: any) => {
        this._state.keyCode = event.keyCode;
      });
    this.initZoom();
    this.initPanel();
    this.initBackground();
  }

  /**
   * Update graph.
   */
  update(): void {
    // console.log('Update');
    this.initNetworkGraph();
    this.updateNetworkGraph();
    this.centerNetworkGraph();
  }

  /**
   * Reset graph.
   */
  reset(): void {
    // console.log('Reset network graph');
    this._selector
      .select('g#panel')
      .style('display', 'none')
      .style('opacity', '0');

    if (this._state.keyCode !== 17) {
      this.resetDragLine();
      this._state.enableConnection = false;
      this._network.view.reset();
    }
  }
}
