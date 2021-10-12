import { reactive, UnwrapRef } from '@vue/composition-api';
import { v4 as uuidv4 } from 'uuid';

import { App } from '../app';
import { Config } from '../config';
import { ModelCode } from './modelCode';
import { ModelParameter } from '../parameter/modelParameter';

export class Model extends Config {
  private readonly _name = 'Model';

  private _abbreviation: string;
  private _app: App; // parent
  private _code: ModelCode; // code for model
  private _doc: any; // doc data of the database
  private _elementType: string; // element type of the model
  private _existing: string; // existing model in NEST
  private _id: string; // model id
  private _idx: number; // generative
  private _label: string; // model label for view
  private _params: ModelParameter[] = []; // model parameters
  private _recordables: any[] = []; // recordables for multimeter
  private _state: UnwrapRef<any>;

  constructor(app: App, model: any = {}) {
    super('Model');
    this._app = app;
    this._code = new ModelCode(this);

    this._doc = model || {};
    this._id = model.id || uuidv4();
    this._idx = this.app.view.state.models.length;

    this._elementType =
      model.elementType !== undefined ? model.elementType : model.element_type;
    this._existing = model.existing || model.id;

    this._label = model.label || '';
    this._abbreviation = model.abbreviation;
    this.update(model);
    this._state = reactive({
      selected: false,
    });
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get app(): App {
    return this._app;
  }

  get code(): ModelCode {
    return this._code;
  }

  get doc(): any {
    return this._doc;
  }

  get elementType(): string {
    return this._elementType;
  }

  get existing(): string {
    return this._existing;
  }

  get id(): string {
    return this._id;
  }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get name(): string {
    return this._name;
  }

  get params(): ModelParameter[] {
    return this._params;
  }

  get recordables(): any[] {
    return this._recordables;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get value(): string {
    return this.id;
  }

  /**
   * Get parameter defaults of a model from NEST Simulator.
   */
  async fetchDefaults(): Promise<any> {
    return this.app.NESTSimulator.httpClient.post(
      this.app.NESTSimulator.url + '/api/GetDefaults',
      {
        model: this._id,
      }
    );
  }

  /**
   * Update recordables from the config.
   */
  updateRecordables(model: any): void {
    if ('recordables' in model) {
      this._recordables = this.config.recordables.filter((recordable: any) =>
        model.recordables.includes(recordable.id)
      );
    }
  }

  /**
   * Get parameter of the model.
   */
  getParameter(id: string): ModelParameter {
    return this._params.find((param: ModelParameter) => param.id === id);
  }

  /**
   * Add parameter to the model specifications.
   */
  addParameter(param: any): void {
    this._params.push(new ModelParameter(this, param));
  }

  /**
   * Create new parameter.
   */
  newParameter(paramId: string, value: any): void {
    const param: any = {
      id: paramId,
      label: paramId,
      value,
      level: 1,
      input: 'valueSlider',
      min: 0,
      max: 100,
      step: 1,
    };
    if (Array.isArray(value)) {
      param.input = 'arrayInput';
    }
    this.addParameter(param);
    this._params.sort((a: any, b: any) => a.id - b.id);
  }

  /**
   * Remove parameter.
   */
  removeParameter(paramId: string): void {
    this._params = this.params.filter(
      (param: ModelParameter) => param.id !== paramId
    );
  }

  /**
   * Update parameter.
   */
  update(model: any): void {
    this._id = model.id;
    this.updateRecordables(model);
    model.params.forEach((param: any) => {
      if (this.getParameter(param.id)) {
        this.updateParameter(param);
      } else {
        this.addParameter(param);
      }
    });
  }

  /**
   * Update parameter.
   */
  updateParameter(param: any): void {
    const idx: number = this._params
      .map((p: ModelParameter) => p.id)
      .indexOf(param.id);
    this._params[idx] = new ModelParameter(this, param);
  }

  modelChanges(): void {}

  /**
   * Clean model index.
   */
  clean(): void {
    this._idx = this._app.view.state.models.indexOf(this);
  }

  /**
   * Clone model object.
   */
  clone(): Model {
    return new Model(this._app, this);
  }

  /**
   * Check if the model is a neuron.
   */
  isNeuron(): boolean {
    return this._elementType === 'neuron';
  }

  /**
   * Check if the model is a recorder.
   */
  isRecorder(): boolean {
    return this._elementType === 'recorder';
  }

  /**
   * Check if the model is a stimulator.
   */
  isStimulator(): boolean {
    return this._elementType === 'stimulator';
  }

  /**
   * Reset state of this model.
   */
  resetState(): void {
    this._state.selected = false;
  }

  /**
   * Delete model object from model list in app.
   */
  async delete(): Promise<any> {
    return this._app.deleteModel(this._doc._id);
  }

  /**
   * Save model object to the database.
   */
  async save(): Promise<any> {
    return this._app.importModel(this);
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): any {
    const model: any = {
      abbreviation: this._abbreviation,
      elementType: this._elementType,
      existing: this._existing,
      id: this._id,
      label: this._label,
      params: this._params.map((param: ModelParameter) => param.toJSON()),
      version: this._app.version,
    };

    // Add recordables if provided.
    if (this._recordables.length > 0) {
      model.recordables = this._recordables.map(
        (recordable: any) => recordable.id
      );
    }
    return model;
  }
}
