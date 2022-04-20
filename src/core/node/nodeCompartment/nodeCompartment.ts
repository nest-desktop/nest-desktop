import { consoleLog } from '../common/logger';
import { ModelCompartmentParameter } from '../model/modelCompartmentParameter';
import { Node } from './node';
import { NodeCompartmentParameter } from './nodeCompartmentParameter';

export class NodeCompartment {
  private readonly _name = 'NodeCompartment';

  private _idx: number; // generative
  private _hash: string;
  private _node: Node; // parent
  private _params: NodeCompartmentParameter[];
  private _parentIdx: number;

  constructor(node: any, nodeCompartment: any) {
    this._node = node;
    this.initParameters(nodeCompartment);
  }

  get filteredParams(): NodeCompartmentParameter[] {
    return this._params.filter(
      (param: NodeCompartmentParameter) => param.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get idx(): number {
    return this._idx;
  }

  get name(): string {
    return this._name;
  }

  get node(): Node {
    return this._node;
  }

  get params(): NodeCompartmentParameter[] {
    return this._params;
  }

  set params(values: any[]) {
    this._params = values.map(
      value => new NodeCompartmentParameter(this, value)
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
        (modelParam: ModelCompartmentParameter) => {
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
    this._params.push(new NodeCompartmentParameter(this, param));
  }

  /**
   * Check if node has parameter component.
   * @param paramId - parameter id
   */
  hasParameter(paramId: string): boolean {
    return (
      this._params.find(
        (param: NodeCompartmentParameter) => param.id === paramId
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
        (param: NodeCompartmentParameter) => param.id === paramId
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
    this._params.forEach((param: NodeCompartmentParameter) => param.reset());
    this.nodeChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.params.map(
      (param: NodeCompartmentParameter) => (param.state.visible = false)
    );
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.params.map(
      (param: NodeCompartmentParameter) => (param.state.visible = true)
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
      params: this._params.map((param: NodeCompartmentParameter) =>
        param.toJSON()
      ),
    };

    return compartment;
  }
}
