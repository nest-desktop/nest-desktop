import { reactive, UnwrapRef } from '@vue/composition-api';
import { v4 as uuidv4 } from 'uuid';

import { App } from '../app';
import { Config } from '../common/config';
import { ModelCompartmentParameter } from './modelCompartmentParameter';
import { ModelParameter } from './modelParameter';
import { ModelReceptor } from './modelReceptor/modelReceptor';

export class Model extends Config {
  private readonly _name = 'Model';

  private _abbreviation: string;
  private _app: App; // parent
  private _compartmentParams: ModelCompartmentParameter[] = []; // model parameters
  private _doc: any; // doc data of the database
  private _elementType: string; // element type of the model
  private _id: string; // model id
  private _idx: number; // generative
  private _label: string; // model label for view
  private _params: ModelParameter[] = []; // model parameters
  private _receptors: ModelReceptor[] = [];
  private _recordables: any[] = []; // recordables for multimeter
  private _state: UnwrapRef<any>;

  constructor(app: App, model: any = {}) {
    super('Model');
    this._app = app;

    this._doc = model || {};
    this._id = model.id || uuidv4();
    this._idx = this.app.model.state.models.length;

    this._elementType =
      model.elementType != null ? model.elementType : model.element_type;

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

  get compartmentParams(): ModelCompartmentParameter[] {
    return this._compartmentParams;
  }

  get doc(): any {
    return this._doc;
  }

  get docId(): string {
    return this._doc ? this._doc._id : undefined;
  }

  get elementType(): string {
    return this._elementType;
  }

  get existing(): string {
    return this._id;
  }

  get hasWeightRecorderParam(): boolean {
    return false;
  }

  get id(): string {
    return this._id;
  }

  get idx(): number {
    return this._idx;
  }

  /**
   * Check if the model is an analog recorder.
   */
  get isAnalogRecorder(): boolean {
    return this.isRecorder && !this.isSpikeRecorder;
  }

  /**
   * Check if the model is a multimeter.
   */
  get isMultimeter(): boolean {
    return this._id === 'multimeter';
  }

  /**
   * Check if the model is a neuron.
   */
  get isNeuron(): boolean {
    return this._elementType === 'neuron';
  }

  /**
   * Check if the model is a recorder.
   */
  get isRecorder(): boolean {
    return this._elementType === 'recorder';
  }

  /**
   * Check if the model is a spike recorder.
   */
  get isSpikeRecorder(): boolean {
    return this._id === 'spike_recorder';
  }

  /**
   * Check if the model is a stimulator.
   */
  get isStimulator(): boolean {
    return this._elementType === 'stimulator';
  }

  /**
   * Check if the model is a synapse.
   */
  get isSynapse(): boolean {
    return this._elementType === 'synapse';
  }

  /**
   * Check if the model is a weight recorder.
   */
  get isWeightRecorder(): boolean {
    return this._id === 'weight_recorder';
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

  get receptors(): ModelReceptor[] {
    return this._receptors;
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

  get weightRecorder(): boolean {
    return false;
  }

  /**
   * Get parameter defaults of a model from NEST Simulator.
   */
  async fetchDefaults(): Promise<any> {
    return this._app.backends.nestSimulator.instance.post('api/GetDefaults', {
      model: this._id,
    });
  }

  /**
   * Update recordables from the config.
   * @param model model object
   */
  updateRecordables(model: any): void {
    if ('recordables' in model) {
      this._recordables = this.config.recordables.filter((recordable: any) =>
        model.recordables.includes(recordable.id)
      );
    }
  }

  /**
   * Get the parameter of the model compartment.
   * @param paramId ID of the searched parameter
   */
  getCompartmentParameter(paramId: string): ModelParameter {
    return this._compartmentParams.find(
      (param: ModelParameter) => param.id === paramId
    );
  }

  /**
   * Get the parameter of the model.
   * @param paramId ID of the searched parameter
   */
  getParameter(paramId: string): ModelParameter {
    return this._params.find((param: ModelParameter) => param.id === paramId);
  }

  /**
   * Check if the model has the parameter specified by the ID.
   * @param paramId ID of the searched parameter
   */
  hasParameter(paramId: string): boolean {
    return this._params.some((param: ModelParameter) => param.id === paramId);
  }

  /**
   * Add a parameter to the model specifications.
   * @param param parameter object
   */
  addParameter(param: any): void {
    this._params.push(new ModelParameter(this, param));
  }

  /**
   * Add a compartment parameter to the model specifications.
   * @param param parameter object
   */
  addCompartmentParameter(param: any): void {
    this._compartmentParams.push(new ModelCompartmentParameter(this, param));
  }

  /**
   * Create new parameter.
   * @param paramId ID of the parameter
   * @param value parameter value
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
   * Remove a parameter.
   * @param paramId ID of the parameter
   */
  removeParameter(paramId: string): void {
    this._params = this.params.filter(
      (param: ModelParameter) => param.id !== paramId
    );
  }

  /**
   * Update  a parameter.
   * @param model model object
   */
  update(model: any): void {
    // Update the model ID.
    this._id = model.id;

    // Update the model recordables.
    this.updateRecordables(model);

    // Update the model parameters.
    this.updateParameters(model);

    // Update the model compartment parameters.
    this.updateCompartmentParameters(model);

    // Update the model receptors.
    this.updateReceptors(model);
  }

  /**
   * Update the model parameters.
   * @param model model object
   */
  updateParameters(model: any): void {
    if (model.hasOwnProperty('params')) {
      model.params.forEach((param: any) => {
        if (this.getParameter(param.id)) {
          this.updateParameter(param);
        } else {
          this.addParameter(param);
        }
      });
    }
  }

  /**
   * Update model compartment parameters.
   * @param model model object
   */
  updateCompartmentParameters(model: any): void {
    if (model.hasOwnProperty('compartmentParams')) {
      model.compartmentParams.forEach((param: any) => {
        if (this.getCompartmentParameter(param.id)) {
          this.updateCompartmentParameter(param);
        } else {
          this.addCompartmentParameter(param);
        }
      });
    }
  }

  /**
   * Update the parameter.
   * @param param parameter object
   */
  updateParameter(param: any): void {
    const idx: number = this._params
      .map((p: ModelParameter) => p.id)
      .indexOf(param.id);
    this._params[idx] = new ModelParameter(this, param);
  }

  /**
   * Update the compartment parameter.
   * @param param parameter object
   */
  updateCompartmentParameter(param: any): void {
    const idx: number = this._compartmentParams
      .map((p: ModelCompartmentParameter) => p.id)
      .indexOf(param.id);
    this._compartmentParams[idx] = new ModelCompartmentParameter(this, param);
  }

  /**
   * Update the model receptors.
   * @param model model object
   */
  updateReceptors(model: any): void {
    if (model.hasOwnProperty('receptors')) {
      this._receptors = model.receptors.map(
        (receptor: any) => new ModelReceptor(this, receptor)
      );
    }
  }

  modelChanges(): void {}

  /**
   * Clean the model index.
   */
  clean(): void {
    this._idx = this._app.model.state.models.indexOf(this);
  }

  /**
   * Clone this model object.
   */
  clone(): Model {
    return new Model(this._app, this);
  }

  /**
   * Reset the state of this model.
   */
  resetState(): void {
    this._state.selected = false;
  }

  /**
   * Delete the model object from model list in app.
   */
  async delete(): Promise<any> {
    return this._app.model.deleteModel(this.docId);
  }

  /**
   * Save the model object to the database.
   */
  async save(): Promise<any> {
    return this._app.model.saveModel(this);
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): any {
    const model: any = {
      abbreviation: this._abbreviation,
      elementType: this._elementType,
      id: this._id,
      label: this._label,
      params: this._params.map((param: ModelParameter) => param.toJSON()),
      version: this._app.state.version,
    };

    // Add the recordables if provided.
    if (this._recordables.length > 0) {
      model.recordables = this._recordables.map(
        (recordable: any) => recordable.id
      );
    }

    // Add the compartment parameters if provided.
    if (this._compartmentParams.length > 0) {
      model.compartmentParams = this._compartmentParams.map(
        (param: ModelParameter) => param.toJSON()
      );
    }

    // Add the receptors if provided.
    if (this._receptors.length > 0) {
      model.receptors = this._receptors.map((receptor: ModelReceptor) =>
        receptor.toJSON()
      );
    }

    return model;
  }
}
