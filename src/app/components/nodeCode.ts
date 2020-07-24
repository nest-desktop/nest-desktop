import { Code } from './code';
import { Spatial } from './spatial';
import { Parameter } from './parameter';
import { Random } from './random';
import { Node } from './node';


export class NodeCode extends Code {
  node: Node;                           // parent

  constructor(node: Node) {
    super();
    this.node = node;
  }

  create(): string {
    let script: string = '';
    script += this.nodeVariable() + ' = nest.Create("' + this.node.modelId + '", ' + this.node.size;
    script += this.nodeParams();
    script += ')';
    return script + '\n';
  }

  getActivity(): string {
    const model: string = this.node.model ? this.node.model.existing : this.node.modelId;
    const nodeVars = this.nodeVariable();
    let script: string = '{';
    if (this.node.network.project.app.nestServer.simulatorVersion.startsWith('2.')) {
      script += this._(2) + '"events": nest.GetStatus(' + nodeVars + ', "events"),';        // NEST 2
    } else {
      script += this._(2) + '"events": ' + nodeVars + '.get("events"),';                    // NEST 3
    }
    if (model === 'spike_detector') {
      script += this._(2) + '"nodeIds": nest.GetStatus(nest.GetConnections(None, ' + nodeVars + '),  "source"),';
    } else {
      script += this._(2) + '"nodeIds": nest.GetStatus(nest.GetConnections(' + nodeVars + '), "target")';
    }
    script += this._() + '}';
    return script;
  }

  nodeVariable(): string {
    return 'node' + this.node.view.label.toUpperCase();
  }

  isRandom(value: any): boolean {
    return value.constructor === Object && value.hasOwnProperty('parametertype');
  }

  XOR(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
  }

  nodeParams(): string {
    let script: string = '';
    if (this.node.params === undefined || this.node.params.length === 0) return script;
    const paramsList: string[] = [];
    this.node.params
      .filter(param => param.visible)
      .map(param => {
        if (param.id === 'record_from') {
          const record_from: string[] = param.value.map(v => '"' + v + '"');
          paramsList.push(this._() + '"' + param.id + '": [' + record_from.join(',') + ']');
          // } else if (this.isRandom(param)) {
          //   if (param.parametertype == 'constant') {
          //     paramsList.push(this._() + '"' + param.id + '": ' + this.format(param.specs.value));
          //   } else {
          //     if (param.specs === undefined) return
          //     if (Object.entries(param.specs).length === 0) return
          //     const values = Object.keys(specs)
          //       .filter(spec => !this.XOR(params[param].parametertype == 'uniform', ['min', 'max'].includes(spec)))
          //       .map(spec => this.format(specs[spec]))
          //     let random: string = 'nest.random.' + params[param].parametertype + '(' + values.join(', ') + ')';
          //     paramsList.push(this._() + '"' + param + '": ' + random)
          //   }
        } else {
          paramsList.push(this._() + '"' + param.id + '": ' + this.format(param.value));
        }
      })
    if (paramsList.length > 0) {
      script += ', params={';
      script += paramsList.join(',')
      script += this.end() + '}';
    }
    return script;
  }

}
