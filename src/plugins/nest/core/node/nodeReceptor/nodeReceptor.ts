// nodeReceptor.ts

import { NodeParameterProps } from "../nodeParameter";
import { ModelReceptor } from "../../model/modelReceptor/modelReceptor";
import { ModelReceptorParameter } from "../../model/modelReceptor/modelReceptorParameter";
import { Node } from "../node";
import { NodeCompartment } from "../nodeCompartment/nodeCompartment";
import { NodeReceptorParameter } from "./nodeReceptorParameter";

export interface NodeReceptorProps {
  compIdx: number;
  id: string;
  params?: NodeParameterProps[];
  type?: string;
}

export class NodeReceptor {
  private readonly _name = "NodeReceptor";

  private _compartment?: NodeCompartment;
  private _hash: string = "";
  private _id: string = "";
  private _idx: number; // generative
  private _node: Node; // parent
  private _params: { [key: string]: NodeReceptorParameter } = {};

  constructor(node: Node, nodeReceptor: NodeReceptorProps) {
    this._node = node;

    this._id = nodeReceptor.id;
    this._idx = this._node.receptors.length;

    if (
      -1 < nodeReceptor.compIdx &&
      nodeReceptor.compIdx < this._node.compartments.length
    ) {
      this._compartment = this._node.compartments[nodeReceptor.compIdx];
    }

    this.initParameters(nodeReceptor);
  }

  get compartment(): NodeCompartment | undefined {
    return this._compartment;
  }

  get filteredParams(): NodeReceptorParameter[] {
    return Object.values(this._params).filter(
      (param: NodeReceptorParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get hasSomeParams(): boolean {
    return Object.values(this._params).some(
      (param: NodeReceptorParameter) => param.state.visible
    );
  }

  get id(): string {
    return this._id;
  }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    return `${this.id} ` + this._compartment
      ? `(${this._compartment?.label})`
      : "";
  }

  get model(): ModelReceptor {
    return this.node.model.receptors[this.id];
  }

  get name(): string {
    return this._name;
  }

  get node(): Node {
    return this._node;
  }

  get params(): { [key: string]: NodeReceptorParameter } {
    return this._params;
  }

  set params(values: { [key: string]: NodeReceptorParameter }) {
    this._params = values;
  }

  get recordables(): any[] {
    if (this.model == undefined) {
      return [];
    }
    const recordables = this.model.recordables.map((recordable: any) => ({
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
   * Add a parameter component.
   * @param param parameter object
   */
  addParameter(param: any): void {
    this._params[param.id] = new NodeReceptorParameter(this, param);
  }

  /**
   * Clean the node receptor.
   */
  clean(): void {
    this._idx = this._node.receptors.indexOf(this);
  }

  /**
   * Check if the node receptor has a parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some(
      (paramKey: string) => paramKey === paramId
    );
  }

  /**
   * Get the parameter component.
   * @param paramId parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this._params[paramId].value;
    }
  }

  /**
   * Initialize the parameter components.
   * @param receptor node receptor object
   */
  initParameters(receptor: NodeReceptorProps): void {
    // Update parameters from model or node receptor
    this._params = {};
    const model = this.node.model;
    if (model && receptor.id) {
      const modelReceptor = model.receptors[receptor.id];
      if (modelReceptor) {
        Object.values(modelReceptor.params).forEach(
          (modelReceptorParam: ModelReceptorParameter) => {
            if (receptor && receptor.params) {
              const receptorParam = receptor.params.find(
                (p: any) => p.id === modelReceptorParam.id
              );
              this.addParameter(receptorParam || modelReceptorParam.toJSON());
            } else {
              this.addParameter(modelReceptorParam.toJSON());
            }
          }
        );
      }
    } else if (receptor.params) {
      receptor.params.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Reset the value in the parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    Object.values(this._params).forEach((param: NodeReceptorParameter) =>
      param.reset()
    );
    this.nodeChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    Object.values(this.params).forEach(
      (param: NodeReceptorParameter) => (param.state.visible = false)
    );
  }

  /**
   * Observer for node receptor changes.
   *
   * @remarks
   * It emits node changes.
   */
  nodeChanges(): void {
    this.clean();
    this._node.nodeChanges();
  }

  /**
   * Delete node receptor.
   *
   * @remarks
   * It removes receptor from the node.
   */
  remove(): void {
    this._node.removeReceptor(this);
    this._node.nodeChanges();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach(
      (param: NodeReceptorParameter) => (param.state.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): NodeReceptorProps {
    return {
      compIdx: this._compartment ? this._compartment.idx : -1,
      id: this.id,
      params: Object.values(this._params).map((param: NodeReceptorParameter) =>
        param.toJSON()
      ),
    };
  }
}
