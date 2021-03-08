import { Code } from '../code';
import { ModelParameter } from '../parameter/modelParameter';
import { Node } from './node';
// import { ParameterRandom } from '../parameterRandom';

export class NodeCode extends Code {
  private _node: Node; // parent

  constructor(node: Node) {
    super();
    this._node = node;
  }

  get label(): string {
    return this._node.view.label;
  }

  get simulatorVersion(): string {
    return this._node.network.project.app.nestServer.state.simulatorVersion;
  }

  create(): string {
    let script = '';
    script += `${this.label} = nest.Create("${this._node.modelId}"`;
    if (!this._node.spatial.hasPositions()) {
      script += `, ${this._node.size}`;
    }
    script += this.nodeParams();
    if (this._node.spatial.hasPositions()) {
      script += this.nodeSpatial();
    }
    script += ')';
    return script + '\n';
  }

  XOR(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
  }

  nodeParams(): string {
    let script = '';
    if (this._node.params === undefined || this._node.params.length === 0) {
      return script;
    }
    const paramsList: string[] = [];
    this._node.params
      .filter((param: ModelParameter) => param.visible)
      .forEach((param: ModelParameter) => {
        if (param.type === 'constant') {
          paramsList.push(
            this._() + `"${param.id}": ${this.format(param.value)}`
          );
        } else {
          const specs: string = param.specs
            .map(spec => this.format(spec.value))
            .join(', ');
          paramsList.push(
            this._() + `"${param.id}": nest.${param.type}(${specs})`
          );
        }
      });
    if (this._node.model.existing === 'multimeter') {
      const recordFrom: string[] = this._node.recordFrom.map(
        (record: string) => '"' + record + '"'
      );
      paramsList.push(this._() + `"record_from": [${recordFrom.join(',')}]`);
    }
    if (paramsList.length > 0) {
      script += ', params={';
      script += paramsList.join(',');
      script += this.end() + '}';
    }
    return script;
  }

  nodeSpatial(): string {
    let script = '';
    script += ', positions=';
    const positions = this._node.spatial.toJSON();
    if (this._node.spatial.positions.name === 'free') {
      if (positions.pos.length > 0) {
        // fixed free positions
        script += `nest.spatial.free([${positions.pos
          .map((p: number[]) => `[${p[0].toFixed(2)},${p[1].toFixed(2)}]`)
          .join(',')}])`;
      } else {
        // generative free positions
        script += `nest.spatial.free(nest.random.uniform(-0.5, 0.5), num_dimensions=2)`;
      }
    } else {
      script += `nest.spatial.grid(${JSON.stringify(positions.shape)})`;
    }
    return script;
  }
}
