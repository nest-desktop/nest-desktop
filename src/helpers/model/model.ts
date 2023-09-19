// model.ts

import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { v4 as uuidv4 } from "uuid";

import { Config } from "@/helpers/config";
import { ModelParameter, ModelParameterProps } from "@/helpers/model/modelParameter";
import { logger as mainLogger } from "@/helpers/common/logger";
// import { useModelDBStore } from "@/store/model/modelDBStore";

export interface ModelProps {
  doc?: any;
  abbreviation?: string;
  elementType?: string;
  id?: string;
  label?: string;
  params?: ModelParameterProps[];
  recordables?: any[];
  version?: string;
}

export class BaseModel extends Config {
  private readonly _name = "Model";

  private _abbreviation: string;
  private _doc: any; // doc data of the database
  private _elementType: string; // element type of the model
  private _id: string; // model id
  // private _idx: number; // generative
  private _label: string; // model label for view
  private _logger: Logger<ILogObj>;
  private _params: { [key: string]: ModelParameter } = {}; // model parameters
  private _paramsVisible: string[] = [];
  private _recordables: any[] = []; // recordables for multimeter
  private _state: UnwrapRef<any>;
  // private _modelDBStore;

  constructor(model: ModelProps = {}, name: string = "Model") {
    super(name);

    this._doc = model;
    this._id = model.id || uuidv4();

    this._logger = mainLogger.getSubLogger({ name: `[${this._id}] model` });

    // this._modelDBStore = useModelDBStore();
    // this._idx = this._modelDBStore.models.length;

    this._elementType = model.elementType || "neuron";

    this._label = model.label || "";
    this._abbreviation = model.abbreviation || "";

    this._state = reactive({
      selected: false,
    });

    this.update(model);
  }

  get abbreviation(): string {
    return this._abbreviation;
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

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  // get idx(): number {
  //   return this._idx;
  // }

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

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get name(): string {
    return this._name;
  }

  get params(): { [key: string]: ModelParameter } {
    return this._params;
  }

  get paramsAll(): ModelParameter[] {
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

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get value(): string {
    return this.id;
  }

  /**
   * Add a parameter to the model specifications.
   * @param param parameter object
   */
  addParameter(param: ModelParameterProps): void {
    this._params[param.id] = new ModelParameter(this, param);
  }

  /**
   * Clean the model index.
   */
  clean(): void {
    // this._idx = this._modelDBStore.models.indexOf(this);
  }

  /**
   * Clone this model object.
   */
  clone(): BaseModel {
    return new BaseModel({ ...this.toJSON() });
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
   * Delete the model object from model list.
   */
  async delete(): Promise<any> {
    // return this._modelDBStore.deleteModel(this.docId);
  }

  changes(): void {}

  /**
   * Create new parameter.
   * @param paramId ID of the parameter
   * @param value parameter value
   */
  newParameter(paramId: string, value: any): void {
    this._logger.trace("new parameter:", paramId);
    const param: any = {
      id: paramId,
      label: paramId,
      value,
      level: 1,
      variant: "valueSlider",
      min: 0,
      max: 100,
      step: 1,
    };
    if (Array.isArray(value)) {
      param.variant = "arrayInput";
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
   * Reset the state of this model.
   */
  resetState(): void {
    this._state.selected = false;
  }

  /**
   * Save the model object to the database.
   */
  async save(): Promise<any> {
    this._logger.trace("save");
    // return this._modelDBStore.saveModel(this._id);
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

    return model;
  }

  /**
   * Update  a parameter.
   * @param model model object
   */
  update(model: any): void {
    this._logger.trace("update");

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
  }

  /**
   * Update the model parameters.
   * @param model model object
   */
  updateParameters(params: ModelParameterProps[]): void {
    // this._logger.trace("update parameters");
    this._params = {};
    params.forEach((param) => {
      this.addParameter(param);
    });
  }

  /**
   * Update recordables from the config.
   * @param model model object
   */
  updateRecordables(model: any): void {
    this._recordables = this.config.recordables?.filter((recordable: any) =>
      model.recordables.includes(recordable.id)
    );
  }
}
