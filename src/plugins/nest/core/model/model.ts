// model.ts

import { reactive, UnwrapRef } from "vue";
import { v4 as uuidv4 } from "uuid";

import { Config } from "@/helpers/config";

import { ModelCompartmentParameter } from "./modelCompartmentParameter";
import { ModelParameter, ModelParameterProps } from "./modelParameter";
import { ModelReceptor } from "./modelReceptor/modelReceptor";

import { useModelDBStore } from "../../store/modelDBStore";

export interface ModelProps {
  abbreviation?: string;
  compartmentalParams?: any[]
  elementType?: string;
  id?: string;
  label?: string;
  params?: ModelParameterProps[];
  receptors?: any[];
  recordables?: any[];
  version?: string;
}

export class Model extends Config {
  private readonly _name = "Model";

  private _abbreviation: string;
  private _compartmentParams: { [key: string]: ModelCompartmentParameter } = {}; // model compartmental parameters
  private _doc: any; // doc data of the database
  private _elementType: string; // element type of the model
  private _id: string; // model id
  private _idx: number; // generative
  private _label: string; // model label for view
  private _params: { [key: string]: ModelParameter } = {}; // model parameters
  private _receptors: { [key: string]: ModelReceptor } = {}; // receptor parameters
  private _recordables: any[] = []; // recordables for multimeter
  private _state: UnwrapRef<any>;
  private _modelDBStore;

  constructor(model: ModelProps = {}) {
    super("Model");

    this._doc = model;
    this._id = model.id || uuidv4();

    this._modelDBStore = useModelDBStore();
    this._idx = this._modelDBStore.models.length;

    this._elementType = model.elementType || "neuron";

    this._label = model.label || "";
    this._abbreviation = model.abbreviation || "";

    this.update(model);

    this._state = reactive({
      selected: false,
    });
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get compartmentParams(): { [key: string]: ModelCompartmentParameter } {
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
    return this._id === "multimeter";
  }

  /**
   * Check if the model is a neuron.
   */
  get isNeuron(): boolean {
    return this._elementType === "neuron";
  }

  /**
   * Check if the model is a recorder.
   */
  get isRecorder(): boolean {
    return this._elementType === "recorder";
  }

  /**
   * Check if the model is a spike recorder.
   */
  get isSpikeRecorder(): boolean {
    return this._id === "spike_recorder";
  }

  /**
   * Check if the model is a stimulator.
   */
  get isStimulator(): boolean {
    return this._elementType === "stimulator";
  }

  /**
   * Check if the model is a synapse.
   */
  get isSynapse(): boolean {
    return this._elementType === "synapse";
  }

  /**
   * Check if the model is a weight recorder.
   */
  get isWeightRecorder(): boolean {
    return this._id === "weight_recorder";
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

  get params(): { [key: string]: ModelParameter } {
    return this._params;
  }

  get receptors(): { [key: string]: ModelReceptor } {
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
  // async fetchDefaults(): Promise<any> {
  //   return this._app.backends.nestSimulator.instance.post("api/GetDefaults", {
  //     model: this._id,
  //   });
  // }

  /**
   * Update recordables from the config.
   * @param model model object
   */
  updateRecordables(model: any): void {
    this._recordables = this.config.recordables.filter((recordable: any) =>
      model.recordables.includes(recordable.id)
    );
  }

  /**
   * Get the parameter of the model compartment.
   * @param paramId ID of the searched parameter
   */
  getCompartmentParameter(paramId: string): ModelParameter {
    return this._compartmentParams[paramId];
  }

  /**
   * Get the parameter of the model.
   * @param paramId ID of the searched parameter
   */
  getParameter(paramId: string): ModelParameter {
    return this._params[paramId];
  }

  /**
   * Check if the model has the parameter specified by the ID.
   * @param paramId ID of the searched parameter
   */
  hasParameter(paramId: string): boolean {
    return paramId in this._params;
  }

  /**
   * Add a parameter to the model specifications.
   * @param param parameter object
   */
  addParameter(param: any): void {
    this._params[param.id] = param;
  }

  /**
   * Add a compartment parameter to the model specifications.
   * @param param parameter object
   */
  addCompartmentParameter(param: any): void {
    this._compartmentParams[param.id] = new ModelCompartmentParameter(
      this,
      param
    );
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
      input: "valueSlider",
      min: 0,
      max: 100,
      step: 1,
    };
    if (Array.isArray(value)) {
      param.input = "arrayInput";
    }
    this.addParameter(param);
    // this._params.sort((a: any, b: any) => a.id - b.id);
  }

  /**
   * Remove a parameter.
   * @param paramId ID of the parameter
   */
  removeParameter(paramId: string): void {
    delete this._params[paramId];
  }

  /**
   * Update  a parameter.
   * @param model model object
   */
  update(model: any): void {
    // Update the model ID.
    this._id = model.id;

    // Update the model recordables.
    if (model.recordables) {
      this.updateRecordables(model);
    }

    // Update the model parameters.
    if (model.params) {
      this.updateParameters(model.params);
    }

    // Update the model compartment parameters.
    if (model.compartmentParams) {
      this.updateCompartmentParameters(model);
    }

    // Update the model receptors.
    if (model.receptors) {
      this.updateReceptors(model);
    }
  }

  /**
   * Update the model parameters.
   * @param model model object
   */
  updateParameters(params: ModelParameterProps[]): void {
    this._params = {};
    params.forEach((param) => {
      this.addParameter(param);
    });
  }

  /**
   * Update model compartment parameters.
   * @param model model object
   */
  updateCompartmentParameters(compartmentParams: any): void {
    this._compartmentParams = {};
    compartmentParams.forEach((param: any) => {
      this.addCompartmentParameter(param);
    });
  }

  /**
   * Update the compartment parameter.
   * @param param parameter object
   */
  updateCompartmentParameter(param: any): void {
    this._compartmentParams[param.id] = new ModelCompartmentParameter(
      this,
      param
    );
  }

  /**
   * Update the model receptors.
   * @param model model object
   */
  updateReceptors(receptors: any[]): void {
    this._receptors = {};
    receptors.forEach((receptor: any) => {
      this._receptors[receptor.id] = new ModelReceptor(this, receptor);
    });
  }

  modelChanges(): void {}

  /**
   * Clean the model index.
   */
  clean(): void {
    this._idx = this._modelDBStore.models.indexOf(this);
  }

  /**
   * Clone this model object.
   */
  clone(): Model {
    return new Model(this.toJSON());
  }

  /**
   * Reset the state of this model.
   */
  resetState(): void {
    this._state.selected = false;
  }

  /**
   * Delete the model object from model list.
   */
  async delete(): Promise<any> {
    return this._modelDBStore.deleteModel(this.docId);
  }

  /**
   * Save the model object to the database.
   */
  async save(): Promise<any> {
    return this._modelDBStore.saveModel(this);
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): ModelProps {
    const model: any = {
      abbreviation: this._abbreviation,
      elementType: this._elementType,
      id: this._id,
      label: this._label,
      params: Object.values(this._params).map((param: ModelParameter) =>
        param.toJSON()
      ),
      version: process.env.APP_VERSION,
    };

    // Add the recordables if provided.
    if (this._recordables.length > 0) {
      model.recordables = this._recordables.map(
        (recordable: any) => recordable.id
      );
    }

    // Add the compartment parameters if provided.
    if (this._compartmentParams) {
      model.compartmentParams = Object.values(this._compartmentParams).map(
        (param: ModelParameter) => param.toJSON()
      );
    }

    // Add the receptors if provided.
    if (this._receptors) {
      model.receptors = Object.values(this._receptors).map(
        (receptor: ModelReceptor) => receptor.toJSON()
      );
    }

    return model;
  }
}
