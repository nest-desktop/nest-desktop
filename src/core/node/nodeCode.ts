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

  /**
   * Write script to create node.
   */
  create(): string {
    let script = '';
    script += `${this.label} = nest.Create("${this._node.modelId}"`;
    const addSizeInSpatial: boolean =
      !this._node.spatial.hasPositions() ||
      (this._node.spatial.hasPositions() &&
        this._node.spatial.positions.name === 'free');
    if (addSizeInSpatial && this._node.model.elementType !== 'recorder') {
      script += `, ${this._node.size}`;
    }
    const params: string = this.nodeParams();
    if (params.length > 0) {
      script += `, params=${params}`;
    }
    if (this._node.spatial.hasPositions()) {
      script +=
        ',' +
        (params.length > 0 ? ' ' : this._()) +
        'positions=' +
        this._node.spatial.positions.toCode();
    }
    script += ')';
    return script + '\n';
  }

  /**
   * XOR logical operation.
   */
  XOR(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
  }

  /**
   * Write script for node parameters.
   */
  nodeParams(): string {
    let script = '';
    if (this._node.params == undefined || this._node.params.length === 0) {
      return script;
    }

    const params: string[] = this._node.filteredParams.map(
      (param: ModelParameter) => `"${param.id}": ${param.toCode()}`
    );

    if (this._node.model.existing === 'multimeter') {
      const recordFrom: string[] = this._node.recordFrom.map(
        (rec: any) => '"' + rec + '"'
      );
      params.push(`"record_from": [${recordFrom.join(',')}]`);
    }

    if (
      this._node.model.elementType === 'recorder' &&
      this._node.network.project.config.simulateWithInsite
    ) {
      params.push('"record_to": "insite"');
    }

    if (this._node.params !== undefined || this._node.params.length > 0) {
      this._node.filteredParams.forEach((param: ModelParameter) =>
        params.push(`"${param.id}": ${param.toCode()}`)
      );
    }

    if (params.length > 0) {
      script += '{' + this._();
      script += params.join(',' + this._());
      script += this.end() + '}';
    }
    return script;
  }
}
