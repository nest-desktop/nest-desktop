// nodeReceptor.ts

import { IParamProps, TParamValue } from "@/helpers/common/parameter";
import { INodeRecordProps } from "@/helpers/node/nodeRecord";
import { NodeView } from "@/helpers/node/nodeView";

import { NESTModelReceptor } from "../../model/modelReceptor/modelReceptor";
import { NESTModelReceptorParameter } from "../../model/modelReceptor/modelReceptorParameter";
import { NESTNode } from "../node";
import { NESTNodeCompartment } from "../nodeCompartment/nodeCompartment";
import { NESTNodeReceptorParameter } from "./nodeReceptorParameter";

export interface INESTNodeReceptorProps {
  compIdx: number;
  id: string;
  params?: IParamProps[];
  type?: string;
}

export class NESTNodeReceptor {
  private readonly _name = "NodeReceptor";

  private _compartment?: NESTNodeCompartment;
  private _hash: string = "";
  private _id: string = "";
  private _idx: number; // generative
  private _node: NESTNode; // parent
  private _params: Record<string, NESTNodeReceptorParameter> = {};
  private _paramsVisible: string[] = [];

  constructor(node: NESTNode, nodeReceptorProps: INESTNodeReceptorProps) {
    this._node = node;

    this._id = nodeReceptorProps.id;
    this._idx = this._node.receptors.length;

    if (-1 < nodeReceptorProps.compIdx && nodeReceptorProps.compIdx < this._node.compartments.length) {
      this._compartment = this._node.compartments[nodeReceptorProps.compIdx];
    }

    this.initParameters(nodeReceptorProps);
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
    return `${this.id} ` + this._compartment ? `(${this._compartment?.label})` : "";
  }

  get model(): NESTModelReceptor {
    return this.node.model.receptors[this.id];
  }

  get name(): string {
    return this._name;
  }

  get node(): NESTNode {
    return this._node;
  }

  get params(): Record<string, NESTNodeReceptorParameter> {
    return this._params;
  }

  set params(values: Record<string, NESTNodeReceptorParameter>) {
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

  get recordables(): INodeRecordProps[] {
    if (this.model == undefined) {
      return [];
    }
    const recordables = this.model.recordables.map((recordable: INodeRecordProps) => ({
      ...recordable,
    }));
    recordables.forEach((recordable: INodeRecordProps) => (recordable.id += this._idx));
    return recordables;
  }

  /**
   * Returns the first six digits of the SHA-1 node hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : "";
  }

  get view(): NodeView {
    return this._node.view;
  }

  /**
   * Add a parameter component.
   * @param parammProps parameter props
   */
  addParameter(paramProps: IParamProps): void {
    this._params[paramProps.id] = new NESTNodeReceptorParameter(this, paramProps);
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
    return Object.keys(this._params).some((paramKey: string) => paramKey === paramId);
  }

  /**
   * Get the parameter component.
   * @param paramId parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): TParamValue | undefined {
    if (this.hasParameter(paramId)) return this._params[paramId].value;
  }

  /**
   * Initialize the parameter components.
   * @param receptor node receptor object
   */
  initParameters(receptorProps: INESTNodeReceptorProps): void {
    // Update parameters from model or node receptor
    this._params = {};
    const model = this.node.model;
    if (model && receptorProps.id) {
      const modelReceptor = model.receptors[receptorProps.id];
      if (modelReceptor) {
        Object.values(modelReceptor.params).forEach((modelReceptorParam: NESTModelReceptorParameter) => {
          if (receptorProps && receptorProps.params) {
            const receptorParam = receptorProps.params.find((p: IParamProps) => p.id === modelReceptorParam.id);
            this.addParameter(receptorParam || modelReceptorParam.toJSON());
          } else {
            this.addParameter(modelReceptorParam.toJSON());
          }
        });
      }
    } else if (receptorProps.params) {
      receptorProps.params.forEach((paramProps: IParamProps) => this.addParameter(paramProps));
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
    this.paramsAll.forEach((param: NESTNodeReceptorParameter) => (param.visible = false));
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
    this.paramsAll.forEach((param: NESTNodeReceptorParameter) => (param.visible = true));
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): INESTNodeReceptorProps {
    return {
      compIdx: this._compartment ? this._compartment.idx : -1,
      id: this.id,
      params: this.filteredParams.map((paramProps: NESTNodeReceptorParameter) => paramProps.toJSON()),
    };
  }
}
