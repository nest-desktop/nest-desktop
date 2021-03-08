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
    const connSpecList: string[] = [
      this._() + `"rule": "${this._connection.rule}"`,
    ];
    this._connection.filteredParams.forEach((param: Parameter) => {
      if (!param.isRandom()) {
        const value: string = ['p'].includes(param.id)
          ? this.format(param.value)
          : param.value.toFixed();
        connSpecList.push(this._() + `"${param.id}": ${value}`);
      } else {
        const specs: string = param.specs
          .map(spec => this.format(spec.value))
          .join(', ');
        if (!param.type.startsWith('spatial')) {
          connSpecList.push(
            this._() + `"${param.id}": nest.${param.type}(${specs})`
          );
        } else if (param.type === 'spatial.distance') {
          let value = `nest.${param.type}`;
          if (param.specs[0].value !== 1) {
            value += ` * ${param.specs[0].value}`;
          }
          if (param.specs[1].value !== 0) {
            value += ` + ${param.specs[1].value}`;
          }
          connSpecList.push(this._() + `"${param.id}": ${value}`);
        } else {
          connSpecList.push(
            this._() +
              `"${param.id}": nest.${param.type}(nest.spatial.distance, ${specs})`
          );
        }
      }
    });

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
