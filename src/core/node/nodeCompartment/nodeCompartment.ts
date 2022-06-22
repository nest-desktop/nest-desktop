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

  constructor(node: any, comp: any = {}) {
    this._node = node;

    this._idx = this._node.compartments.length;
    this._parentIdx = comp.parentIdx;
    this._label = comp.label;

    this.initParameters(comp);
  }

  get filteredParams(): NodeCompartmentParameter[] {
    return this._params.filter(
      (param: NodeCompartmentParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get hasSomeParams(): boolean {
    return this._params.some(
      (param: NodeCompartmentParameter) => param.state.visible
    );
  }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    if (this._label) {
      return this._label;
    } else {
      const label = this._parentIdx === -1 ? 'soma' : 'dendrite';
      const idx = this._node.compartments
        .filter((comp: NodeCompartment) => comp.parentIdx === this._parentIdx)
        .indexOf(this);
      return `${label} ${idx + 1}`;
    }
  }

  get labelFull(): string {
    if (this._label) {
      return this._label;
    } else {
      return (
        `${this.label}` +
        (this._parentIdx != -1 ? ` of ${this.parent.label}` : '')
      );
    }
  }

  get labelShort(): string {
    return this.label
      .split(' ')
      .map((v: string) => v[0])
      .join('');
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

  get parent(): NodeCompartment {
    return this._parentIdx === -1
      ? this
      : this._node.compartments[this._parentIdx];
  }

  get parentIdx(): number {
    return this._parentIdx;
  }

  set parentIdx(value: number) {
    this._parentIdx = value === this._idx ? -1 : value;
    this.nodeChanges();
  }

  get receptors(): NodeReceptor[] {
    return this.node.receptors.filter(
      (receptor: NodeReceptor) => receptor.compartment === this
    );
  }

  get recordables(): any[] {
    const recordables = this._node.model.recordables.map((recordable: any) => ({
      ...recordable,
    }));
    recordables.forEach((recordable: any) => (recordable.id += this._idx));
    return recordables;
  }

  /**
   * Returns the first six digits of the SHA-1 node hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  /**
   * Add a receptor to the node compartment.
   */
  addReceptor(receptor: any): void {
    receptor.compIdx = this._idx;
    this._node.addReceptor(receptor);
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 7);
  }

  /**
   * Clean the node compartment.
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
   * Initialize the parameter components.
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
   * Add a parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params.push(new NodeCompartmentParameter(this, param));
  }

  /**
   * Check if the node compartment has a parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return this._params.some(
      (param: NodeCompartmentParameter) => param.id === paramId
    );
  }

  /**
   * Get the parameter component.
   * @param paramId - parameter ID
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
   * Reset the value in parameter components.
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
   * Remove the node compartment.
   *
   * @remarks
   * It removes compartment from the list.
   */
  remove(): void {
    this._node.removeCompartment(this);
    this._node.compartments.forEach((comp: NodeCompartment) => comp.clean());
    this._node.nodeChanges();
  }

  /**
   * Copy the node object of this component.
   *
   * @remarks
   * It uses the JSON converting method.
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

    if (this._label) {
      comp.label = this._label;
    }

    return comp;
  }
}
