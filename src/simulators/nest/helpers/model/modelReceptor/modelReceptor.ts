// modelReceptor.ts

import { BaseObj } from "@/helpers/common/base";
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

export class NESTModelReceptor extends BaseObj {
  private readonly _name = "ModelReceptor";

  private _id: string;
  private _label: string;
  private _model: NESTModel; // parent
  private _params: { [key: string]: NESTModelReceptorParameter } = {};
  private _paramsVisible: string[] = [];
  private _recordables: any[] = []; // recordables for multimeter

  constructor(model: NESTModel, modelReceptorProps: INESTModelReceptorProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._model = model;

    this._id = modelReceptorProps.id;
    this._label = modelReceptorProps.label;

    this.updateParameters(modelReceptorProps);
    this.updateRecordables(modelReceptorProps);
  }

  get filteredParams(): NESTModelReceptorParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
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
        (recordable: any) => recordable.id
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
    this._params[paramProps.id].update(paramProps);
  }

  /**
   * Update model parameters.
   */
  updateParameters(modelReceptorProps: INESTModelReceptorProps): void {
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
   * Update the recordables from the config.
   */
  updateRecordables(model: any): void {
    if (model.recordables) {
      this._recordables = this._model.config?.localStorage.recordables.filter(
        (recordable: any) => model.recordables.includes(recordable.id)
      );
    }
  }
}
