// modelReceptor.ts

import { type UnwrapRef, reactive } from "vue";

import { BaseObj, type IBaseState, type IParamState } from "@/helpers/common";
import { type INodeRecordState } from "@/networkGraph/helpers/node/nodeRecord";

import { NESTModelReceptorParameter } from "./modelReceptorParameter";
import type { NESTModel } from "@/workspaces/nest/types";

export interface INESTModelReceptorState extends IBaseState {
  id: string;
  label: string;
  params?: IParamState[];
  recordables?: string[];
}

interface INESTModelReceptorRefState {
  paramsVisible: string[];
}

export class NESTModelReceptor extends BaseObj {
  // private readonly _name = "ModelReceptor";

  private _id: string;
  private _label: string;
  private _model: NESTModel; // parent
  private _params: Record<string, NESTModelReceptorParameter> = {};
  private _state: UnwrapRef<INESTModelReceptorRefState>;
  private _recordables: INodeRecordState[] = []; // recordables for multimeter

  constructor(model: NESTModel, modelReceptorState: INESTModelReceptorState) {
    super();

    this._model = model;

    this._id = modelReceptorState.id;
    this._label = modelReceptorState.label;

    this._state = reactive<INESTModelReceptorRefState>({
      paramsVisible: [],
    });

    this.load(modelReceptorState);
  }

  get filteredParams(): NESTModelReceptorParameter[] {
    return this._state.paramsVisible.map((paramId) => this._params[paramId]);
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  // get name(): string {
  //   return this._name;
  // }

  get model(): NESTModel {
    return this._model;
  }

  get params(): Record<string, NESTModelReceptorParameter> {
    return this._params;
  }

  set params(values: Record<string, NESTModelReceptorParameter>) {
    this._params = values;
  }

  get paramsAll(): NESTModelReceptorParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._state.paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._state.paramsVisible = values;
    this.changes();
  }

  get recordables(): INodeRecordState[] {
    return this._recordables;
  }

  get state(): UnwrapRef<INESTModelReceptorRefState> {
    return this._state;
  }

  /**
   * Add a parameter instance.
   * @param paramState parameter instance
   */
  addParameter(paramState: IParamState): void {
    this._params[paramState.id] = new NESTModelReceptorParameter(this, paramState);
  }

  /**
   * Observer for model receptor changes.
   * @remarks It emits model changes.
   */
  changes(): void {
    this.clean();
    this._model.changes();
  }

  /**
   * Clean model receptor.
   */
  clean(): void {}

  /**
   * Get parameter instance.
   * @param paramId parameter ID
   * @return parameter instance
   */
  getParameter(paramId: string): NESTModelReceptorParameter | undefined {
    return this._params[paramId];
  }

  /**
   * Check if a model receptor has a parameter instance.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return paramId in this._params;
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.paramsVisible = [];
  }

  /**
   * Init model parameters.
   */
  initParameters(modelReceptorState: INESTModelReceptorState): void {
    if (modelReceptorState.params) {
      modelReceptorState.params.forEach((paramState: IParamState) => {
        if (this.getParameter(paramState.id)) {
          this.updateParameter(paramState);
        } else {
          this.addParameter(paramState);
        }
      });
    }
  }

  /**
   * Load model receptor from state.
   * @param modelReceptorState model receptor state
   */
  load(modelReceptorState: INESTModelReceptorState): void {
    this.initParameters(modelReceptorState);
    this.updateRecordables(modelReceptorState);
  }

  /**
   * Delete the model receptor.
   * @remarks It removes the receptor from the model.
   */
  remove(): void {
    // this._model.deleteReceptor(this);
  }

  /**
   * Reset value in parameter components.
   * @remarks It emits model changes.
   */
  resetParameters(): void {
    Object.values(this._params).forEach((param: NESTModelReceptorParameter) => param.reset());
    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsVisible = Object.keys(this._params);
  }

  /**
   * Save NEST model receptor to state.
   * @return NEST model receptor state
   */
  override save(): INESTModelReceptorState {
    const receptorState: INESTModelReceptorState = {
      id: this._id,
      label: this._label,
      params: this.filteredParams.map((param: NESTModelReceptorParameter) => param.save()),
    };

    // Add recordables if provided.
    if (this._recordables.length > 0)
      receptorState.recordables = this._recordables.map((recordable: INodeRecordState) => recordable.id);

    return receptorState;
  }

  /**
   * Update a parameter.
   */
  updateParameter(paramState: IParamState): void {
    this._params[paramState.id].init(paramState);
  }

  /**
   * Update the recordables from the config.
   */
  updateRecordables(modelState: INESTModelReceptorState): void {
    if (modelState.recordables)
      this._recordables = this._model.config?.localStorage.recordables.filter((recordable: INodeRecordState) =>
        modelState?.recordables?.includes(recordable.id),
      );
  }
}
