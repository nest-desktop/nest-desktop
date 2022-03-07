import { Config } from '../common/config';
import { Node } from '../node/node';
import { Parameter } from '../parameter/parameter';

export class NodeSlice extends Config {
  private readonly _name = 'NodeSlice';
  private _node: Node;
  private _params: Parameter[] = [];
  private _visible: boolean = false;

  constructor(node: Node, params: any[] = []) {
    super('NodeSlice');
    this._node = node;
    this.initParameters(params);
    this._visible = params.length > 0;
  }

  get node(): Node {
    return this._node;
  }

  get visible(): boolean {
    return this._visible;
  }

  get name(): string {
    return this._name;
  }

  get params(): Parameter[] {
    return this._params;
  }

  toggleVisible(): void {
    this._visible = !this._visible;
  }

  /**
   * Initialize parameters.
   */
  initParameters(params: any[] = undefined): void {
    this._params = [];
    this.config.params.forEach((param: any) => {
      if (params != null) {
        const p: any = params.find((p: any) => p.id === param.id);
        if (p != null) {
          param.value = p.value;
          param.disabled = false;
        }
      }
      this._params.push(new Parameter(this, param));
    });
  }

  /**
   * Get indices of node slicing
   */
  get indices(): string {
    if (this._params.length === 0) {
      return '';
    }

    const start: Parameter = this._params[0];
    const stop: Parameter = this._params[1];
    const step: Parameter = this._params[2];

    if (start.disabled && stop.disabled && step.disabled) {
      return '';
    }

    const params: Parameter[] = [start, stop];
    if (!step.disabled) {
      params.push(step);
    }

    const indices = params.map((param: Parameter) =>
      param.disabled ? null : param.value
    );
    return `[${indices.join(':')}]`;
  }

  /**
   * Update node slice.
   */
  update(): void {
    if (this._params[1].disabled) {
      this._params[1].value = this._node.size;
    }
  }

  /**
   * Serialize for JSON.
   * @return node slice object
   */
  toJSON(): any {
    return this._params
      .filter((param: Parameter) => !param.disabled)
      .map((param: Parameter) => {
        return {
          id: param.id,
          value: param.value,
        };
      });
  }
}
