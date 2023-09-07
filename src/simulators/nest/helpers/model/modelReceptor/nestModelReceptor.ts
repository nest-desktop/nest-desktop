// nestModelReceptor.ts

import { NESTModel } from "../nestModel";
import {
  NESTModelReceptorParameter,
  NESTModelReceptorParameterProps,
} from "./nestModelReceptorParameter";

export interface NESTModelReceptorProps {
  id: string;
  label: string;
  params?: NESTModelReceptorParameterProps[];
  recordables?: string[];
}

export class NESTModelReceptor {
  private readonly _name = "ModelReceptor";

  private _hash: string = "";
  private _id: string;
  private _label: string;
  private _model: NESTModel; // parent
  private _params: { [key: string]: NESTModelReceptorParameter } = {};
  private _paramsVisible: string[] = [];
  private _recordables: any[] = []; // recordables for multimeter

  constructor(model: NESTModel, modelReceptor: NESTModelReceptorProps) {
    this._model = model;

    this._id = modelReceptor.id;
    this._label = modelReceptor.label;

    this.updateParameters(modelReceptor);
    this.updateRecordables(modelReceptor);
  }

  get filteredParams(): NESTModelReceptorParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
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

  get model(): NESTModel {
    return this._model;
  }

  get params(): { [key: string]: NESTModelReceptorParameter } {
    return this._params;
  }

  set params(values: { [key: string]: NESTModelReceptorParameter }) {
    this._params = values;
  }

  get paramsAll(): NESTModelReceptorParameter[] {
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
  addParameter(param: NESTModelReceptorParameterProps): void {
    this._params[param.id] = new NESTModelReceptorParameter(this, param);
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
    this.paramsAll.forEach(
      (param: NESTModelReceptorParameter) => (param.state.visible = false)
    );
  }

  /**
   * Observer for model receptor changes.
   *
   * @remarks
   * It emits model changes.
   */
  changes(): void {
    this.clean();
    this._model.changes();
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
    Object.values(this._params).forEach((param: NESTModelReceptorParameter) =>
      param.reset()
    );
    this.changes();
  }

  // /**
  //  * Sets all params to visible.
  //  */
  showAllParams(): void {
    this.paramsAll.forEach(
      (param: NESTModelReceptorParameter) => (param.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): NESTModelReceptorProps {
    const receptor: NESTModelReceptorProps = {
      id: this._id,
      label: this._label,
      params: this.filteredParams.map((param: NESTModelReceptorParameter) =>
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
  updateParameter(param: NESTModelReceptorParameterProps): void {
    this._params[param.id].update(param);
  }

  /**
   * Update model parameters.
   */
  updateParameters(modelReceptor: NESTModelReceptorProps): void {
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
