import * as d3 from 'd3';

import { ConnectionGraph } from '../../connection/connectionGraph/connectionGraph';
import { Network } from '../network';
import { NetworkGraphWorkspace } from './networkGraphWorkspace';
import { NodeGraph } from '../../node/nodeGraph/nodeGraph';
import { Node } from '../../node/node';

export class NetworkGraph {
  private _connectionGraph: ConnectionGraph;
  private _network: Network;
  private _workspace: NetworkGraphWorkspace;
  private _nodeGraph: NodeGraph;
  private _selector: d3.Selection<any, any, any, any>;
  private _config: any = {
    nodeRadius: 20,
    strokeWidth: 3,
  };

  constructor(selector: string) {
    this._selector = d3.select(selector);

    this._workspace = new NetworkGraphWorkspace(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);
  }

  get config(): any {
    return this._config;
  }

  get network(): Network {
    return this._network;
  }

  set network(value: Network) {
    this._network = value;
  }

  get nodeGraph(): NodeGraph {
    return this._nodeGraph;
  }

  get selector(): d3.Selection<any, any, any, any> {
    return this._selector;
  }

  get workspace(): NetworkGraphWorkspace {
    return this._workspace;
  }

  dragStart(event: any): void {
    this._workspace.state.dragging = true;
    if (event.sourceEvent.srcElement.parentNode instanceof Node) {
      d3.select(event.sourceEvent.srcElement.parentNode).classed(
        'active',
        true
      ); // .raise();
      d3.select(event.sourceEvent.srcElement).style('cursor', 'grabbing');
    }
  }

  dragEnd(event: any): void {
    this._workspace.state.dragging = false;
    // If-clause to prevent the error message
    // when mouseup happens outside the window.
    if (event.sourceEvent.srcElement.parentNode instanceof Node) {
      d3.select(event.sourceEvent.srcElement.parentNode).classed(
        'active',
        false
      );
      d3.select(event.sourceEvent.srcElement).style('cursor', 'pointer');
    }
    this._workspace.updateTransform();
  }

  /**
   * Render network graph.
   */
  render(): void {
    this._network.consoleLog(
      'Render network graph of ' + this._network.project.shortId
    );
    this._connectionGraph.render();
    this._nodeGraph.render();
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  update(): void {
    this._network.consoleLog(
      'Update network graph of ' + this._network.project.shortId
    );
    this._workspace.update();
    this._connectionGraph.update();
    this._nodeGraph.update();
  }

  /**
   * Resize graph.
   */
  resize(width: number, height: number): void {
    this._selector.attr('width', width).attr('height', height);
  }
}
