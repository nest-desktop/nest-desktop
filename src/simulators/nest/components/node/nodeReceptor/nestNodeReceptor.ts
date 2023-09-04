// nestNodeReceptor.ts

import { NodeParameterProps } from "@/components/node/nodeParameter";

import { NESTModelReceptor } from "../../model/modelReceptor/nestModelReceptor";
import { NESTModelReceptorParameter } from "../../model/modelReceptor/nestModelReceptorParameter";
import { NESTNode } from "../nestNode";
import { NESTNodeCompartment } from "../nodeCompartment/nestNodeCompartment";
import { NESTNodeReceptorParameter } from "./nestNodeReceptorParameter";

export interface NESTNodeReceptorProps {
  compIdx: number;
  id: string;
  params?: NodeParameterProps[];
  type?: string;
}

export class NESTNodeReceptor {
  private readonly _name = "NodeReceptor";

  private _compartment?: NESTNodeCompartment;
  private _hash: string = "";
  private _id: string = "";
  private _idx: number; // generative
  private _node: NESTNode; // parent
  private _params: { [key: string]: NESTNodeReceptorParameter } = {};
  private _paramsVisible: string[] = [];

  constructor(node: NESTNode, nodeReceptor: NESTNodeReceptorProps) {
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

  get compartment(): NESTNodeCompartment | undefined {
    return this._compartment;
  }

  get filteredParams(): NESTNodeReceptorParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hash(): string {
    return this._hash;
  }

  // get hasSomeParams(): boolean {
  //   return Object.values(this._params).some(
  //     (param: NodeReceptorParameter) => param.visible
  //   );
  // }

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

  get model(): NESTModelReceptor {
    return this.node.nestModel.receptors[this.id];
  }

  get name(): string {
    return this._name;
  }

  get node(): NESTNode {
    return this._node;
  }

  get params(): { [key: string]: NESTNodeReceptorParameter } {
    return this._params;
  }

  set params(values: { [key: string]: NESTNodeReceptorParameter }) {
    this._params = values;
  }

  get paramsAll(): NESTNodeReceptorParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
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
    this._params[param.id] = new NESTNodeReceptorParameter(this, param);
  }

  /**
   * Observer for node receptor changes.
   *
   * @remarks
   * It emits node changes.
   */
  changes(): void {
    this.clean();
    this._node.changes();
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
  initParameters(receptor: NESTNodeReceptorProps): void {
    // Update parameters from model or node receptor
    this._params = {};
    const model = this.node.nestModel;
    if (model && receptor.id) {
      const modelReceptor = model.receptors[receptor.id];
      if (modelReceptor) {
        Object.values(modelReceptor.params).forEach(
          (modelReceptorParam: NESTModelReceptorParameter) => {
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
   */
  resetParameters(): void {
    this.paramsAll.forEach((param: NESTNodeReceptorParameter) => param.reset());
    this.changes();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.paramsAll.forEach(
      (param: NESTNodeReceptorParameter) => (param.visible = false)
    );
  }

  /**
   * Remove node receptor.
   */
  remove(): void {
    this._node.removeReceptor(this);
    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsAll.forEach(
      (param: NESTNodeReceptorParameter) => (param.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): NESTNodeReceptorProps {
    return {
      compIdx: this._compartment ? this._compartment.idx : -1,
      id: this.id,
      params: this.filteredParams.map((param: NESTNodeReceptorParameter) =>
        param.toJSON()
      ),
    };
  }
}
