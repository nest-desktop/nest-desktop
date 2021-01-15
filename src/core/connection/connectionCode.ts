import { Code } from '../code';
import { Connection } from './connection';
import { Node } from '../node/node';
import { Model } from '../model/model';
import { Parameter } from '../parameter';

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
    const connSpecList: string[] = [
      this._() + `"rule": "${this._connection.rule}"`,
    ];
    this._connection.params.forEach((param: Parameter) =>
      connSpecList.push(this._() + `"${param.id}": ${param.value}`)
    );

    let script = ', conn_spec={';
    script += connSpecList.join(',');
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
