import { consoleLog } from '../../common/logger';
import { Model } from '../model';
import { ModelReceptorParameter } from './modelReceptorParameter';

export class ModelReceptor {
  private readonly _name = 'ModelReceptor';

  private _hash: string;
  private _id: string;
  private _label: string;
  private _model: Model; // parent
  private _params: ModelReceptorParameter[] = [];
  private _recordables: any[] = []; // recordables for multimeter

  constructor(model: any, modelReceptor: any) {
    this._model = model;

    this._id = modelReceptor.id;
    this._label = modelReceptor.label;

    this.updateParameters(modelReceptor);
    this.updateRecordables(modelReceptor);
  }

  get filteredParams(): ModelReceptorParameter[] {
    return this._params.filter(
      (param: ModelReceptorParameter) => param.visible
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

  get params(): ModelReceptorParameter[] {
    return this._params;
  }

  set params(values: any[]) {
    this._params = values.map(value => new ModelReceptorParameter(this, value));
  }

  get recordables(): any[] {
    return this._recordables;
  }

  /**
   * Returns the first six digits of the SHA-1 model hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 7);
  }

  /**
   * Clean model receptor.
   */
  clean(): void {}

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
   * Update model parameters.
   */
  updateParameters(modelReceptor: any): void {
    if (modelReceptor.hasOwnProperty('params')) {
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
   * Update a parameter.
   */
  updateParameter(param: any): void {
    const idx: number = this._params
      .map((p: ModelReceptorParameter) => p.id)
      .indexOf(param.id);
    this._params[idx] = new ModelReceptorParameter(this, param);
  }

  /**
   * Update the recordables from the config.
   */
  updateRecordables(model: any): void {
    if ('recordables' in model) {
      this._recordables = this._model.config.recordables.filter(
        (recordable: any) => model.recordables.includes(recordable.id)
      );
    }
  }

  /**
   * Add a parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params.push(new ModelReceptorParameter(this, param));
  }

  /**
   * Check if a model receptor has a parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return this._params.some(
      (param: ModelReceptorParameter) => param.id === paramId
    );
  }

  /**
   * Get parameter component.
   * @param paramId parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this._params.find(
        (param: ModelReceptorParameter) => param.id === paramId
      ).value;
    }
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits model changes.
   */
  resetParameters(): void {
    this._params.forEach((param: ModelReceptorParameter) => param.reset());
    this.modelChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.params.map(
      (param: ModelReceptorParameter) => (param.state.visible = false)
    );
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.params.map(
      (param: ModelReceptorParameter) => (param.state.visible = true)
    );
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
   * Copy the model object of this component.
   *
   * @remarks
   * It uses the JSON converting method.
   *
   * @return copied model object
   */
  copy(item: any): any {
    return Object.assign({}, item);
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): any {
    const receptor: any = {
      id: this._id,
      label: this._label,
      params: this._params.map((param: ModelReceptorParameter) =>
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
}
