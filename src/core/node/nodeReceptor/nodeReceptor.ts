import { consoleLog } from '../common/logger';
import { ModelCompartmentParameter } from '../model/modelCompartmentParameter';
import { Node } from './node';
import { NodeCompartmentParameter } from './nodeCompartmentParameter';

export class NodeReceptor {
  private readonly _name = 'NodeReceptor';

  private _comp_idx: number; // generative
  private _hash: string;
  private _node: Node; // parent
  private _params: NodeReceptorParameter[];

  constructor(node: any, nodeCompartment: any) {
    this._node = node;
    this.initParameters(nodeCompartment);
  }

  get filteredParams(): NodeReceptorParameter[] {
    return this._params.filter(
      (param: NodeReceptorParameter) => param.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get comp_idx(): number {
    return this._comp_idx;
  }

  get name(): string {
    return this._name;
  }

  get node(): Node {
    return this._node;
  }

  get params(): NodeReceptorParameter[] {
    return this._params;
  }

  set params(values: any[]) {
    this._params = values.map(
      value => new NodeReceptorParameter(this, value)
    );
  }

  get parentIdx(): number {
    return this._parentIdx;
  }

  /**
   * Returns the first six digits of the SHA-1 node hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 7);
  }

  /**
   * Clean node compartment.
   */
  clean(): void {}

  /**
   * Observer for node compartment changes.
   *
   * @remarks
   * It emits node changes.
   */
  nodeChanges(): void {
    this.clean();
    this._node.nodeChanges();
  }

  /**
   * Initialize parameter components.
   * @param compartment - node object
   */
  initParameters(compartment: any = null): void {
    // Update parameters from model or node
    this._params = [];
    const model = this.node.model;
    if (model) {
      model.compartmentParams.forEach(
        (modelParam: ModelReceptorParameter) => {
          if (compartment && compartment.hasOwnProperty('params')) {
            const compartmentParam = compartment.params.find(
              (p: any) => p.id === modelParam.id
            );
            this.addParameter(compartmentParam || modelParam.toJSON());
          } else {
            this.addParameter(modelParam.toJSON());
          }
        }
      );
    } else if (compartment.hasOwnProperty('params')) {
      compartment.params.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params.push(new NodeReceptorParameter(this, param));
  }

  /**
   * Check if node has parameter component.
   * @param paramId - parameter id
   */
  hasParameter(paramId: string): boolean {
    return (
      this._params.find(
        (param: NodeReceptorParameter) => param.id === paramId
      ) !== undefined
    );
  }

  /**
   * Get parameter component.
   * @param paramId - parameter id
   * @return parameter component
   */
  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this._params.find(
        (param: NodeReceptorParameter) => param.id === paramId
      ).value;
    }
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    this._params.forEach((param: NodeReceptorParameter) => param.reset());
    this.nodeChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.params.map(
      (param: NodeReceptorParameter) => (param.state.visible = false)
    );
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.params.map(
      (param: NodeReceptorParameter) => (param.state.visible = true)
    );
  }

  /**
   * Delete node compartment.
   *
   * @remarks
   * It removes compartment from the node.
   */
  remove(): void {
    // this._node.deleteCompartement(this);
  }

  /**
   * Copy node object of this component.
   *
   * @remarks
   * It uses JSON converting method.
   *
   * @return copied node object
   */
  copy(item: any): any {
    return Object.assign({}, item);
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): any {
    const compartment: any = {
      params: this._params.map((param: NodeReceptorParameter) =>
        param.toJSON()
      ),
    };

    return compartment;
  }
}
