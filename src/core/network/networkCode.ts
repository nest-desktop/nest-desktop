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

  createNodes(): string {
    let script = '';
    this._network.nodes.forEach((node: Node) => (script += node.code.create()));
    return script;
  }

  connectNodes(): string {
    let script = '';
    this._network.connections.forEach(
      (connection: Connection) => (script += connection.code.connect())
    );
    return script;
  }

  getActivities(): string {
    let script = '';
    script += 'response = {';
    script += this._() + '"kernel": {"time": nest.GetKernelStatus("time")},';
    script += this._() + '"activities": [';
    const activities: string[] = this._network.recorders.map((node: Node) =>
      node.code.getActivity()
    );
    script += activities.join(',');
    script += ']';
    script += this.end() + '}';
    return script + '\n';
  }
}
