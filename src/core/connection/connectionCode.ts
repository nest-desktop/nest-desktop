import { Code } from '../code';
import { Connection } from './connection';
import { Model } from '../model/model';
import { Node } from '../node/node';
import { Parameter } from '../parameter/parameter';

export class ConnectionCode extends Code {
  private _connection: Connection; // parent

  constructor(connection: Connection) {
    super();
    this._connection = connection;
  }

  get sourceLabel(): string {
    return this._connection.source.code.label;
  }

  get targetLabel(): string {
    return this._connection.target.code.label;
  }

  connSpec(): string {
    const connSpecList: string[] = [`"rule": "${this._connection.rule}"`];
    this._connection.filteredParams.forEach((param: Parameter) =>
      connSpecList.push(param.toCode())
    );

    let script = ', conn_spec={' + this._();
    script += connSpecList.join(',' + this._());
    script += this.end() + '}';
    return script;
  }

  connect(): string {
    let sourceNode: Node = this._connection.source;
    let targetNode: Node = this._connection.target;
    const targetModel: Model = targetNode.model;
    if (['multimeter', 'voltmeter'].includes(targetModel.id)) {
      [sourceNode, targetNode] = [targetNode, sourceNode];
    }

    let script = '';
    script += `nest.Connect(${this.sourceLabel}, ${this.targetLabel}`;
    script += this.connSpec();
    script += this._connection.synapse.code.synSpec();
    script += ')';
    return script + '\n';
  }
}
