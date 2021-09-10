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

  /**
   * Write script of connection specifications.
   */
  specs(): string {
    let script = '';
    if (this._connection.filteredParams.length > 0) {
      const specs: string[] = [`"rule": "${this._connection.rule}"`];
      this._connection.filteredParams.forEach((param: Parameter) =>
        specs.push(`"${param.id}": ${param.toCode()}`)
      );
      script += ', conn_spec={' + this._();
      script += specs.join(',' + this._());
      script += this.end() + '}';
    } else {
      script += `, "${this._connection.rule}"`;
    }
    return script;
  }

  /**
   * Write script to connect nodes.
   */
  connect(): string {
    let sourceNode: Node = this._connection.source;
    let targetNode: Node = this._connection.target;
    const targetModel: Model = targetNode.model;
    if (['multimeter', 'voltmeter'].includes(targetModel.id)) {
      [sourceNode, targetNode] = [targetNode, sourceNode];
    }

    let script = '';
    script += `nest.Connect(${this.sourceLabel}, ${this.targetLabel}`;
    script += this.specs();
    script += this._connection.synapse.code.specs();
    script += ')';
    return script + '\n';
  }
}
