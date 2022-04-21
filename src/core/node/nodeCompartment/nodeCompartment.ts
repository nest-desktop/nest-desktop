import { consoleLog } from '../../common/logger';
import { ModelCompartmentParameter } from '../../model/modelCompartmentParameter';
import { Node } from '../node';
import { NodeCompartmentParameter } from './nodeCompartmentParameter';
import { NodeReceptor } from '../nodeReceptor/nodeReceptor';

export class NodeCompartment {
  private readonly _name = 'NodeCompartment';

  private _idx: number = 0; // generative
  private _hash: string;
  private _label: string;
  private _node: Node; // parent
  private _params: NodeCompartmentParameter[] = [];
  private _parentIdx: number;

  constructor(node: any, comp: any) {
    this._node = node;
    this._parentIdx = comp.parentIdx;
    this.initParameters(comp);
    this._idx = this._node.compartments.length;

    if (!comp.hasOwnProperty('label')) {
      this._label = this._parentIdx === -1 ? 'soma' : `dendrite ${this._idx}`;
    }
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

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
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

  get receptors(): NodeReceptor[] {
    return this.node.receptors.filter(
      (receptor: NodeReceptor) => receptor.compIdx === this._idx
    );
  }

  get receptor(): NodeReceptor | undefined {
    const receptors = this.receptors;
    return receptors ? receptors[0] : undefined;
  }

  get recordable(): any {
    return {
      id: `v_comp${this._idx}`,
      label: `Membrane potentials of ${this._label}`,
    };
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
  clean(): void {
    this._idx = this._node.compartments.indexOf(this);
  }

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
   * @param comp - node compartment object
   */
  initParameters(comp: any = null): void {
    // Update parameters from model or node compartment
    this._params = [];
    const model = this.node.model;
    if (model) {
      model.compartmentParams.forEach(
        (modelParam: ModelCompartmentParameter) => {
          if (comp && comp.hasOwnProperty('params')) {
            const compartmentParam = comp.params.find(
              (p: any) => p.id === modelParam.id
            );
            this.addParameter(compartmentParam || modelParam.toJSON());
          } else {
            this.addParameter(modelParam.toJSON());
          }
        }
      );
    } else if (comp.hasOwnProperty('params')) {
      comp.params.forEach((param: any) => this.addParameter(param));
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
   * Check if node compartment has parameter component.
   * @param paramId - parameter id
   */
  hasParameter(paramId: string): boolean {
    return this._params.some(
      (param: NodeCompartmentParameter) => param.id === paramId
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
   * It emits node compartment changes.
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
   * Remove node compartment.
   *
   * @remarks
   * It removes compartment from the node.
   */
  remove(): void {
    this._node.removeCompartment(this);
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
    const comp: any = {
      parentIdx: this._parentIdx,
      params: this._params.map((param: NodeCompartmentParameter) =>
        param.toJSON()
      ),
    };

    return comp;
  }
}
