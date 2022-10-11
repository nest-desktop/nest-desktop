import * as d3 from 'd3';

import { ConnectionGraph } from '../../connection/connectionGraph/connectionGraph';
import { ModelAssignGraph } from '../../model/modelGraph/modelAssignGraph';
import { Network } from '../network';
import { NetworkGraphWorkspace } from './networkGraphWorkspace';
import { Node } from '../../node/node';
import { NodeGraph } from '../../node/nodeGraph/nodeGraph';

export class NetworkGraph {
  private _config: any = {
    nodeRadius: 20,
    strokeWidth: 3,
    transparentWorkspace: true,
  };
  private _connectionGraph: ConnectionGraph;
  private _modelAssignGraph: ModelAssignGraph;
  private _network: Network;
  private _nodeGraph: NodeGraph;
  private _selector: d3.Selection<any, any, any, any>;
  private _workspace: NetworkGraphWorkspace;

  constructor(selector: string) {
    this._selector = d3.select(selector);

    this._workspace = new NetworkGraphWorkspace(this);
    this._modelAssignGraph = new ModelAssignGraph(this);
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

  /**
   * Call on drag start.
   */
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

  /**
   * Call on drag end.
   */
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
    this._network.clean();
    this._workspace.updateTransform();
  }

  /**
   * Render network graph.
   */
  render(): void {
    this._network.consoleLog(
      'Render network graph of ' + this._network.project.shortId
    );
    this._modelAssignGraph.render();
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
    this._modelAssignGraph.update();
    this._connectionGraph.update();
    this._nodeGraph.update();
  }

  /**
   * Resize graph.
   */
  resize(width: number, height: number): void {
    this._selector.attr('width', width).attr('height', height);
  }

  /**
   * Download network graph as svg image.
   */
  downloadImage(): void {
    // Get svg element.
    var svg = this._selector.node();

    // Get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //  Add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }

    // Add xml declaration.
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // Convert svg source to URI data scheme.
    var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

    // Create download link.
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `nest_desktop-${this._network.project.name}-${this._network.project.app.datetime}.svg`;
    document.body.appendChild(downloadLink);

    // Apply download.
    downloadLink.click();

    // Remove download link.
    document.body.removeChild(downloadLink);
  }
}
