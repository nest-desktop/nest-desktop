// modelReceptor.ts

import { UnwrapRef, reactive } from "vue";

import { BaseObj } from "@/helpers/common/base";
import { IModelProps } from "@/helpers/model/model";
import { INodeRecordProps } from "@/helpers/node/nodeRecord";

import { NESTModel } from "../model";
import {
  INESTModelReceptorParamProps,
  NESTModelReceptorParameter,
} from "./modelReceptorParameter";

export interface INESTModelReceptorProps {
  id: string;
  label: string;
  params?: INESTModelReceptorParamProps[];
  recordables?: string[];
}

interface INESTModelReceptorState {
  paramsVisible: string[];
}

export class NESTModelReceptor extends BaseObj {
  private readonly _name = "ModelReceptor";

  private _id: string;
  private _label: string;
  private _model: NESTModel; // parent
  private _params: Record<string, NESTModelReceptorParameter> = {};
  private _state: UnwrapRef<INESTModelReceptorState>;
  private _recordables: INodeRecordProps[] = []; // recordables for multimeter

  constructor(model: NESTModel, modelReceptorProps: INESTModelReceptorProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._model = model;

    this._id = modelReceptorProps.id;
    this._label = modelReceptorProps.label;

    this._state = reactive<INESTModelReceptorState>({
      paramsVisible: [],
    });

    this.initParameters(modelReceptorProps);
    this.updateRecordables(modelReceptorProps);
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

  get name(): string {
    return this._name;
  }

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

  get recordables(): INodeRecordProps[] {
    return this._recordables;
  }

  get state(): UnwrapRef<INESTModelReceptorState> {
    return this._state;
  }

  /**
   * Add a parameter component.
   * @param param - parameter object
   */
  addParameter(paramProps: INESTModelReceptorParamProps): void {
    this._params[paramProps.id] = new NESTModelReceptorParameter(
      this,
      paramProps
    );
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
   * Get parameter component.
   * @param paramId parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): NESTModelReceptorParameter | undefined {
    return this._params[paramId];
  }

  /**
   * Check if a model receptor has a parameter component.
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
  initParameters(modelReceptorProps: INESTModelReceptorProps): void {
    if (modelReceptorProps.params) {
      modelReceptorProps.params.forEach(
        (paramProps: INESTModelReceptorParamProps) => {
          if (this.getParameter(paramProps.id)) {
            this.updateParameter(paramProps);
          } else {
            this.addParameter(paramProps);
          }
        }
      );
    }
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
    Object.values(this._params).forEach((param: NESTModelReceptorParameter) =>
      param.reset()
    );
    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsVisible = Object.keys(this._params);
  }

  /**
   * Serialize for JSON.
   * @return receptor props
   */
  toJSON(): INESTModelReceptorProps {
    const receptorProps: INESTModelReceptorProps = {
      id: this._id,
      label: this._label,
      params: this.filteredParams.map((param: NESTModelReceptorParameter) =>
        param.toJSON()
      ),
    };

    // Add recordables if provided.
    if (this._recordables.length > 0) {
      receptorProps.recordables = this._recordables.map(
        (recordable: INodeRecordProps) => recordable.id
      );
    }

    return receptorProps;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash(this.toJSON());
  }

  /**
   * Update a parameter.
   */
  updateParameter(paramProps: INESTModelReceptorParamProps): void {
    this._params[paramProps.id].init(paramProps);
  }

  /**
   * Update the recordables from the config.
   */
  updateRecordables(modelProps: IModelProps): void {
    if (modelProps.recordables) {
      this._recordables = this._model.config?.localStorage.recordables.filter(
        (recordable: INodeRecordProps) =>
          modelProps?.recordables?.includes(recordable.id)
      );
    }
  }
}
