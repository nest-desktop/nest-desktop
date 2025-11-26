// nodeReceptor.ts

import type { IParamState } from "@/helpers/common/parameter";
import type { INodeRecordState } from "@/networkGraph/helpers/node/nodeRecord";
import { NodeView } from "@/networkGraph/helpers/node/nodeView";

import { NESTModelReceptor } from "../../../../helpers/model/modelReceptor/modelReceptor";
import { NESTNode } from "../node";
import { NESTNodeCompartment } from "../nodeCompartment/nodeCompartment";
import { NESTNodeReceptorParameters } from "./nodeReceptorParameters";

export interface INESTNodeReceptorState {
  compIdx: number;
  id: string;
  params?: Record<string, IParamState>;
  type?: string;
}

export class NESTNodeReceptor {
  private _compartment?: NESTNodeCompartment;
  private _hash: string = "";
  private _id: string = "";
  private _node: NESTNode; // parent
  private _params: NESTNodeReceptorParameters;

  constructor(node: NESTNode) {
    this._node = node;

    this._params = new NESTNodeReceptorParameters(this);
  }

  get compartment(): NESTNodeCompartment | undefined {
    return this._compartment;
  }

  get hash(): string {
    return this._hash;
  }

  get id(): string {
    return this._id;
  }

  get idx(): number {
    return this.node.receptors.indexOf(this);
  }

  get label(): string {
    return `${this.id} ` + this.compartment ? `(${this.compartment?.label})` : "";
  }

  get model(): NESTModelReceptor | undefined {
    return this.node.model.receptors[this.id];
  }

  get node(): NESTNode {
    return this._node;
  }

  get params(): NESTNodeReceptorParameters {
    return this._params;
  }

  get recordables(): INodeRecordState[] {
    if (this.model == undefined) {
      return [];
    }
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
   * Observer for node receptor changes.
   * @remarks It emits node changes.
   */
  changes(props?: Record<string, unknown>): void {
    this.clean();
    this.node.changes(props);
  }

  /**
   * Clean the node receptor.
   */
  clean(): void {}

  /**
   * Load NEST node receptor from state.
   * @param nodeReceptorState node receptor state
   */
  load(nodeReceptorState: INESTNodeReceptorState): void {
    this._id = nodeReceptorState.id;

    if (-1 < nodeReceptorState.compIdx && nodeReceptorState.compIdx < this._node.compartments.length) {
      this._compartment = this._node.compartments[nodeReceptorState.compIdx];
    }

    if (nodeReceptorState.params) this.params.load(nodeReceptorState.params);
  }

  /**
   * Remove node receptor.
   */
  remove(): void {
    this.node.removeReceptor(this);
    this.changes();
  }

  /**
   * Save node receptor to state.
   * @return node receptor state
   */
  save(): INESTNodeReceptorState {
    const nodeReceptorState: INESTNodeReceptorState = {
      compIdx: this._compartment ? this._compartment.idx : -1,
      id: this.id,
    };

    if (this.params.hasSomeVisibleParams) nodeReceptorState.params = this.params.save();

    return nodeReceptorState;
  }
}
