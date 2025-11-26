// modelReceptor.ts

import { BaseObj, type IBaseState, type IParamState } from "@/helpers/common";
import { type INodeRecordState } from "@/networkGraph/helpers/node/nodeRecord";
import type { NESTModel } from "@/workspaces/nest/types";

import { NESTModelReceptorParameters } from "./modelReceptorParameters";

export interface INESTModelReceptorState extends IBaseState {
  id: string;
  label: string;
  params?: Record<string, IParamState>;
  recordables?: string[];
}

export class NESTModelReceptor extends BaseObj {
  private _id: string = "";
  private _label: string = "";
  private _model: NESTModel; // parent
  private _params: NESTModelReceptorParameters;
  private _recordables: INodeRecordState[] = []; // recordables for multimeter

  constructor(model: NESTModel) {
    super();

    this._model = model;
    this._params = new NESTModelReceptorParameters(this);
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  get model(): NESTModel {
    return this._model;
  }

  get params(): NESTModelReceptorParameters {
    return this._params;
  }

  get recordables(): INodeRecordState[] {
    return this._recordables;
  }

  /**
   * Observer for model receptor changes.
   * @remarks It emits model changes.
   */
  changes(): void {
    this.clean();
    this.model.changes();
  }

  /**
   * Clean model receptor.
   */
  clean(): void {}

  /**
   * Load model receptor from state.
   * @param modelReceptorState model receptor state
   */
  load(modelReceptorState: INESTModelReceptorState): void {
    this._id = modelReceptorState.id;
    this._label = modelReceptorState.label;

    if (modelReceptorState.params) this.params.load(modelReceptorState.params);
    if (modelReceptorState.recordables) this.loadRecordables(modelReceptorState.recordables);
  }

  /**
   * Load the recordables from state.
   * @param recordables recordables
   */
  loadRecordables(recordables: string[]): void {
    if (!recordables) return;
    this._recordables = this.model.config?.localStorage.recordables.filter((recordable: INodeRecordState) =>
      recordables.includes(recordable.id as string),
    );
  }

  /**
   * Delete the model receptor.
   * @remarks It removes the receptor from the model.
   */
  remove(): void {
    // this._model.deleteReceptor(this);
  }

  /**
   * Save NEST model receptor to state.
   * @return NEST model receptor state
   */
  override save(): INESTModelReceptorState {
    const receptorState: INESTModelReceptorState = {
      id: this._id,
      label: this._label,
      params: this.params.save(),
    };

    // Add recordables if provided.
    if (this.recordables.length > 0)
      receptorState.recordables = this.recordables.map((recordable: INodeRecordState) => recordable.id as string);

    return receptorState;
  }
}
