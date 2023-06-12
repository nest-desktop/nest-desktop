// nodeReceptor.ts

import { nodeParamProps } from "../nodeParameter";
import { ModelReceptor } from "../../model/modelReceptor/modelReceptor";
import { ModelReceptorParameter } from "../../model/modelReceptor/modelReceptorParameter";
import { Node } from "../node";
import { NodeCompartment } from "../nodeCompartment/nodeCompartment";
import { NodeReceptorParameter } from "./nodeReceptorParameter";

export interface nodeReceptorProps {
  compIdx: number;
  id: string;
  params?: nodeParamProps[];
  type?: string;
}

export class NodeReceptor {
  private readonly _name = "NodeReceptor";

  private _compartment: NodeCompartment;
  private _hash: string = "";
  private _id: string = "";
  private _idx: number; // generative
  private _node: Node; // parent
  private _params: { [key: string]: NodeReceptorParameter } = {};

  constructor(node: Node, nodeReceptor: nodeReceptorProps) {
    this._node = node;

    this._id = nodeReceptor.id || nodeReceptor.type;
    this._idx = this._node.receptors.length;

    this.initCompartment(nodeReceptor.compIdx);
    this.initParameters(nodeReceptor);
  }

  get compartment(): NodeCompartment {
    return this._compartment;
  }

  get filteredParams(): NodeReceptorParameter[] {
    return this._params.filter(
      (param: NodeReceptorParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get hasSomeParams(): boolean {
    return this._params.some(
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
    return `${this.id} (${this.compartment.label})`;
  }

  get model(): ModelReceptor | undefined {
    return this.node.model
      ? this.node.model.receptors.find(
          (modelReceptor: ModelReceptor) => modelReceptor.id === this.id
        )
      : undefined;
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
   * Initialize the compartment component.
   * @param compIdx compartment index
   */
  initCompartment(compIdx: number): void {
    if (compIdx < this._node.compartments.length) {
      this._compartment = this._node.compartments[compIdx];
    }
  }

  /**
   * Initialize the parameter components.
   * @param receptor node receptor object
   */
  initParameters(receptor: nodeReceptorProps): void {
    // Update parameters from model or node receptor
    this._params = {};
    const model = this.node.model;
    if (model) {
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
  toJSON(): nodeReceptorProps {
    return {
      compIdx: this._compartment.idx,
      id: this.id,
      params: Object.values(this._params).map((param: NodeReceptorParameter) =>
        param.toJSON()
      ),
    };
  }
}
