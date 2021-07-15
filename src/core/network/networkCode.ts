import { Code } from '../code';
import { Connection } from '../connection/connection';
import { Network } from './network';
import { Node } from '../node/node';

export class NetworkCode extends Code {
  private _network: Network; // parent

  constructor(network: Network) {
    super();
    this._network = network;
  }

  /**
   * Generate script to create nodes.
   */
  createNodes(): string {
    let script = '';
    this._network.nodes.forEach((node: Node) => {
      script += node.code.create();
    });
    return script;
  }

  /**
   * Generate script to connect nodes.
   */
  connectNodes(): string {
    let script = '';
    this._network.connections.forEach((connection: Connection) => {
      script += connection.code.connect();
    });
    return script;
  }

  /**
   * Generate script to get node positions.
   */
  getNodePositions(): string {
    let script = 'dict(numpy.concatenate([';
    const nodes = this._network.nodes
      .filter((node: Node) => node.spatial.hasPositions())
      .map((node: Node) => this._(2) + `getPosition(${node.view.label})`);
    script += `${nodes.join(',\n')}`;
    script += this._() + ']))';
    return script;
  }

  /**
   * Generate script to get activities.
   */
  getActivities(): string {
    let script = '[';
    const activities: string[] = this._network.recorders.map(
      (node: Node) => `getActivity(${node.view.label})`
    );
    if (activities.length > 0) {
      script += this._(2) + activities.join(',' + this._(2));
    }
    script += this._() + ']';
    return script;
  }
}
