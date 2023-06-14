// modelReceptor.ts

import { Model } from "../model";
import {
  ModelReceptorParameter,
  ModelReceptorParameterProps,
} from "./modelReceptorParameter";

export interface ModelReceptorProps {
  id: string;
  label: string;
  params?: ModelReceptorParameterProps[];
  recordables?: string[];
}

export class ModelReceptor {
  private readonly _name = "ModelReceptor";

  private _hash: string = "";
  private _id: string;
  private _label: string;
  private _model: Model; // parent
  private _params: { [key: string]: ModelReceptorParameter } = {};
  private _recordables: any[] = []; // recordables for multimeter

  constructor(model: Model, modelReceptor: ModelReceptorProps) {
    this._model = model;

    this._id = modelReceptor.id;
    this._label = modelReceptor.label;

    this.updateParameters(modelReceptor);
    this.updateRecordables(modelReceptor);
  }

  get filteredParams(): ModelReceptorParameter[] {
    return Object.values(this._params).filter(
      (param: ModelReceptorParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
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

  get model(): Model {
    return this._model;
  }

  get params(): { [key: string]: ModelReceptorParameter } {
    return this._params;
  }

  set params(values: { [key: string]: ModelReceptorParameter }) {
    this._params = values;
  }

  get recordables(): any[] {
    return this._recordables;
  }

  /**
   * Returns the first six digits of the SHA-1 model hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : "";
  }

  /**
   * Add a parameter component.
   * @param param - parameter object
   */
  addParameter(param: ModelReceptorParameterProps): void {
    this._params[param.id] = new ModelReceptorParameter(this, param);
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
  getParameter(paramId: string): ModelReceptorParameter | undefined {
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
    Object.values(this.params).forEach(
      (param: ModelReceptorParameter) => (param.state.visible = false)
    );
  }

  /**
   * Observer for model receptor changes.
   *
   * @remarks
   * It emits model changes.
   */
  modelChanges(): void {
    this.clean();
    this._model.modelChanges();
  }

  /**
   * Delete the model receptor.
   *
   * @remarks
   * It removes the receptor from the model.
   */
  remove(): void {
    // this._model.deleteReceptor(this);
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits model changes.
   */
  resetParameters(): void {
    Object.values(this._params).forEach((param: ModelReceptorParameter) =>
      param.reset()
    );
    this.modelChanges();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach(
      (param: ModelReceptorParameter) => (param.state.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): ModelReceptorProps {
    const receptor: ModelReceptorProps = {
      id: this._id,
      label: this._label,
      params: this.filteredParams.map((param: ModelReceptorParameter) =>
        param.toJSON()
      ),
    };

    // Add recordables if provided.
    if (this._recordables.length > 0) {
      receptor.recordables = this._recordables.map(
        (recordable: any) => recordable.id
      );
    }

    return receptor;
  }

  /**
   * Update a parameter.
   */
  updateParameter(param: ModelReceptorParameterProps): void {
    this._params[param.id].update(param);
  }

  /**
   * Update model parameters.
   */
  updateParameters(modelReceptor: ModelReceptorProps): void {
    if (modelReceptor.params) {
      modelReceptor.params.forEach((param: any) => {
        if (this.getParameter(param.id)) {
          this.updateParameter(param);
        } else {
          this.addParameter(param);
        }
      });
    }
  }

  /**
   * Update the recordables from the config.
   */
  updateRecordables(model: any): void {
    if (model.recordables) {
      this._recordables = this._model.config.recordables.filter(
        (recordable: any) => model.recordables.includes(recordable.id)
      );
    }
  }
}
