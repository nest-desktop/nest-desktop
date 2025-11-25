// nodeCompartment.ts

import type { IParamState, TParamValue } from "@/helpers/common/parameter";
import type { INodeRecordState } from "@/networkGraph/helpers/node/nodeRecord";
import { NodeView } from "@/networkGraph/helpers/node/nodeView";

import { NESTModel } from "../../../../helpers/model/model";
import { NESTModelCompartmentParameter } from "../../../../helpers/model/modelCompartmentParameter";
import { NESTNode } from "../node";
import { type INESTNodeReceptorState, NESTNodeReceptor } from "../nodeReceptor/nodeReceptor";
import { NESTNodeCompartmentParameter } from "./nodeCompartmentParameter";

export interface INESTNodeCompartmentState {
  parentIdx: number;
  params?: IParamState[];
  label?: string;
}

export class NESTNodeCompartment {
  // private readonly _name = "NodeCompartment";

  private _idx: number = -1; // generative
  private _hash: string = "";
  private _label: string | undefined;
  private _node: NESTNode; // parent
  private _params: Record<string, NESTNodeCompartmentParameter> = {};
  private _paramsVisible: string[] = [];
  private _parentIdx: number = -1;

  constructor(node: NESTNode) {
    this._node = node;
    this._idx = this._node.compartments.length;
  }

  get filteredParams(): NESTNodeCompartmentParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hash(): string {
    return this._hash;
  }

  // get hasSomeParams(): boolean {
  //   return Object.values(this._params).some(
  //     (param: NodeCompartmentParameter) => param.visible
  //   );
  // }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    if (this._label) {
      return this._label;
    } else {
      const label = this._parentIdx === -1 ? "soma" : "dendrite";
      const idx = this._node.compartments
        .filter((comp: NESTNodeCompartment) => comp.parentIdx === this._parentIdx)
        .indexOf(this);
      return `${label} ${idx + 1}`;
    }
  }

  get labelFull(): string {
    if (this._label) {
      return this._label;
    } else {
      return `${this.label}` + (this._parentIdx != -1 ? ` of ${this.parent.label}` : "");
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

  get model(): NESTModel {
    return this.node.model as NESTModel;
  }

  // get name(): string {
  //   return this._name;
  // }

  get node(): NESTNode {
    return this._node;
  }

  get params(): Record<string, NESTNodeCompartmentParameter> {
    return this._params;
  }

  set params(values: Record<string, NESTNodeCompartmentParameter>) {
    this._params = values;
  }

  get paramsAll(): NESTNodeCompartmentParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get parent(): NESTNodeCompartment {
    return this._parentIdx === -1 ? this : this._node.compartments[this._parentIdx];
  }

  get parentIdx(): number {
    return this._parentIdx;
  }

  set parentIdx(value: number) {
    this._parentIdx = value === this._idx ? -1 : value;
    this.changes();
  }

  get receptors(): NESTNodeReceptor[] {
    return this.node.receptors.filter((receptor: NESTNodeReceptor) => receptor.compartment === this);
  }

  get recordables(): INodeRecordState[] {
    const recordables = this._node.model.recordables.map((recordable: INodeRecordState) => ({
      ...recordable,
    }));
    recordables.forEach((recordable: INodeRecordState) => (recordable.id += this._idx));
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
   * Add a receptor to the node compartment.
   */
  addReceptor(receptorState: INESTNodeReceptorState): void {
    receptorState.compIdx = this._idx;
    this._node.addReceptor(receptorState);
  }

  /**
   * Add a parameter component.
   * @param param - parameter instance
   */
  addParameter(paramState: IParamState): void {
    this._params[paramState.id] = new NESTNodeCompartmentParameter(this, paramState);
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
   * @return parameter value
   */
  getParameter(paramId: string): TParamValue | undefined {
    if (this.hasParameter(paramId)) {
      return this._params[paramId].value;
    }
  }

  /**
   * Check if the node compartment has a parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some((paramKey: string) => paramKey === paramId);
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.paramsAll.forEach((param: NESTNodeCompartmentParameter) => (param.visible = false));
  }

  /**
   * Initialize the parameter components.
   * @param compState - node compartment state
   */
  initParameters(compState?: INESTNodeCompartmentState): void {
    // Update parameters from model or node compartment
    this._params = {};
    const model = this.model;
    if (model) {
      Object.values(model.compartmentParams).forEach((modelParam: NESTModelCompartmentParameter) => {
        if (compState && "params" in compState) {
          const compartmentParam = compState?.params?.find((p: IParamState) => p.id === modelParam.id);
          this.addParameter(compartmentParam || modelParam.save());
        } else {
          this.addParameter(modelParam.save());
        }
      });
    } else {
      compState?.params?.forEach((paramState: IParamState) => this.addParameter(paramState));
    }
  }

  /**
   * Load node compartment from state
   * @param state node compartment staste
   */
  load(state: INESTNodeCompartmentState): void {
    this._parentIdx = state.parentIdx;
    this._label = state.label;

    this.initParameters(state);
  }

  /**
   * Remove the node compartment.
   *
   * @remarks
   * It removes compartment from the list.
   */
  remove(): void {
    this._node.removeCompartment(this);
    this._node.compartments.forEach((comp: NESTNodeCompartment) => comp.clean());
    this.changes();
  }

  /**
   * Reset the value in parameter components.
   *
   * @remarks
   * It emits node compartment changes.
   */
  resetParameters(): void {
    this.paramsAll.forEach((param: NESTNodeCompartmentParameter) => param.reset());
    this.changes();
  }

  /**
   * Save node compartment to state.
   * @return node compartment state
   */
  save(): INESTNodeCompartmentState {
    const nodeCompartmentState: INESTNodeCompartmentState = {
      parentIdx: this._parentIdx,
      params: this.filteredParams.map((param: NESTNodeCompartmentParameter) => param.save()),
    };

    if (this._label) nodeCompartmentState.label = this._label;

    return nodeCompartmentState;
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsAll.forEach((param: NESTNodeCompartmentParameter) => (param.visible = true));
  }
}
