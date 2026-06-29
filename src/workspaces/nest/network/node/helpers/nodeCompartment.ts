// nodeCompartment.ts

import { INodeRecordState, NodeParameters, NodeView } from "@/network";
import { BaseObj, type IBaseState } from "@/core";
import type { IParamState } from "@/parameter";

import type { INESTNodeReceptorState, NESTNodeReceptor } from "./nodeReceptor";
import type { NESTModel } from "../../../model";
import type { NESTNode } from "../node";

export interface INESTNodeCompartmentState extends IBaseState {
  parentIdx: number;
  params?: Record<string, IParamState>;
  label?: string;
}

export class NESTNodeCompartment extends BaseObj {
  private _label: string | undefined;
  private _node: NESTNode; // parent
  private _params: NodeParameters;
  private _parentIdx: number = -1;

  constructor(node: NESTNode) {
    super();

    this._node = node;

    this._params = new NodeParameters(this);
  }

  get idx(): number {
    return this.node.compartments.indexOf(this);
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
      return `${this.label}` + (this._parentIdx != -1 ? ` of ${this.parent?.label}` : "");
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

  get node(): NESTNode {
    return this._node;
  }

  get params(): NodeParameters {
    return this._params;
  }

  get parent(): NESTNodeCompartment | undefined {
    return this.parentIdx === -1 ? this : this.node.compartments[this.parentIdx];
  }

  get parentIdx(): number {
    return this._parentIdx;
  }

  set parentIdx(value: number) {
    this._parentIdx = value === this.idx ? -1 : value;
    // this.changes();
  }

  get receptors(): NESTNodeReceptor[] {
    return this.node.receptors.filter((receptor: NESTNodeReceptor) => receptor.compartment === this);
  }

  get recordables(): INodeRecordState[] {
    const recordables = this.model.recordables.map((recordable: INodeRecordState) => ({
      ...recordable,
    }));
    recordables.forEach((recordable: INodeRecordState) => (recordable.id += this.idx));
    return recordables;
  }

  get view(): NodeView {
    return this._node.view;
  }

  /**
   * Add a receptor to the node compartment.
   */
  addReceptor(receptorState: INESTNodeReceptorState): void {
    receptorState.compIdx = this.idx;
    this._node.addReceptor(receptorState);
  }

  // /**
  //  * Observer for node compartment changes.
  //  */
  // changes(): void {
  //   this.clean();
  // }

  /**
   * Clean the node compartment.
   */
  clean(): void {
    // this._idx = this._node.compartments.indexOf(this);
  }

  /**
   * Load node compartment from state
   * @param state node compartment staste
   */
  load(state: INESTNodeCompartmentState): void {
    this._parentIdx = state.parentIdx;
    this._label = state.label;

    if (state.params) this.params.load(state.params);
  }

  /**
   * Remove the node compartment.
   *
   * @remarks
   * It removes compartment from the list.
   */
  remove(): void {
    this.node.removeCompartment(this);
    this.node.compartments.forEach((comp: NESTNodeCompartment) => comp.clean());
    // this.changes();
  }

  /**
   * Save node compartment to state.
   * @return node compartment state
   */
  override save(): INESTNodeCompartmentState {
    const nodeCompartmentState: INESTNodeCompartmentState = {
      parentIdx: this._parentIdx,
    };

    if (this.label) nodeCompartmentState.label = this.label;
    if (this.params.hasSomeVisibleParams) nodeCompartmentState.params = this.params.save();

    return nodeCompartmentState;
  }
}
