// nodeCompartment.ts

import { ModelCompartmentParameter } from "../../model/modelCompartmentParameter";
import { Node } from "../node";
import { NodeParameterProps } from "../nodeParameter";
import { NodeCompartmentParameter } from "./nodeCompartmentParameter";
import { NodeReceptor } from "../nodeReceptor/nodeReceptor";

export interface NodeCompartmentProps {
  parentIdx: number;
  params?: NodeParameterProps[];
  label?: string;
}

export class NodeCompartment {
  private readonly _name = "NodeCompartment";

  private _idx: number = 0; // generative
  private _hash: string = "";
  private _label: string | undefined;
  private _node: Node; // parent
  private _params: { [key: string]: NodeCompartmentParameter } = {};
  private _parentIdx: number;

  constructor(node: any, comp: NodeCompartmentProps) {
    this._node = node;
    this._idx = this._node.compartments.length;

    this._parentIdx = comp.parentIdx;
    this._label = comp.label;

    this.initParameters(comp);
  }

  get filteredParams(): NodeCompartmentParameter[] {
    return Object.values(this._params).filter(
      (param: NodeCompartmentParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get hasSomeParams(): boolean {
    return Object.values(this._params).some(
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
      const label = this._parentIdx === -1 ? "soma" : "dendrite";
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
        (this._parentIdx != -1 ? ` of ${this.parent.label}` : "")
      );
    }
  }

  get labelShort(): string {
    return this.label
      .split(" ")
      .map((v: string) => v[0])
      .join("");
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

  get params(): { [key: string]: NodeCompartmentParameter } {
    return this._params;
  }

  set params(values: { [key: string]: NodeCompartmentParameter }) {
    this._params = values;
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
    this.changes();
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
    return this._hash ? this._hash.slice(0, 6) : "";
  }

  /**
   * Add a receptor to the node compartment.
   */
  addReceptor(receptor: any): void {
    receptor.compIdx = this._idx;
    this._node.addReceptor(receptor);
  }

  /**
   * Add a parameter component.
   * @param param - parameter object
   */
  addParameter(param: NodeParameterProps): void {
    this._params[param.id] = new NodeCompartmentParameter(this, param);
  }

  /**
   * Observer for node compartment changes.
   *
   * @remarks
   * It emits node changes.
   */
  changes(): void {
    this.clean();
    this._node.changes();
  }

  /**
   * Clean the node compartment.
   */
  clean(): void {
    this._idx = this._node.compartments.indexOf(this);
  }

  /**
   * Get the parameter component.
   * @param paramId - parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this._params[paramId].value;
    }
  }

  /**
   * Check if the node compartment has a parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some(
      (paramKey: string) => paramKey === paramId
    );
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    Object.values(this._params).forEach(
      (param: NodeCompartmentParameter) => (param.state.visible = false)
    );
  }

  /**
   * Initialize the parameter components.
   * @param comp - node compartment object
   */
  initParameters(comp: any = null): void {
    // Update parameters from model or node compartment
    this._params = {};
    const model = this._node.model;
    if (model) {
      Object.values(model.compartmentParams).forEach(
        (modelParam: ModelCompartmentParameter) => {
          if (comp && "params" in comp) {
            const compartmentParam = comp.params.find(
              (p: any) => p.id === modelParam.id
            );
            this.addParameter(compartmentParam || modelParam.toJSON());
          } else {
            this.addParameter(modelParam.toJSON());
          }
        }
      );
    } else if ("params" in comp) {
      comp.params.forEach((param: NodeParameterProps) =>
        this.addParameter(param)
      );
    }
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
    this.changes();
  }

  /**
   * Reset the value in parameter components.
   *
   * @remarks
   * It emits node compartment changes.
   */
  resetParameters(): void {
    Object.values(this._params).forEach((param: NodeCompartmentParameter) =>
      param.reset()
    );
    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this._params).forEach(
      (param: NodeCompartmentParameter) => (param.state.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): NodeCompartmentProps {
    const comp: NodeCompartmentProps = {
      parentIdx: this._parentIdx,
      params: Object.values(this._params).map(
        (param: NodeCompartmentParameter) => param.toJSON()
      ),
    };

    if (this._label) {
      comp.label = this._label;
    }

    return comp;
  }
}
