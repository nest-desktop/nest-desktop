// model.ts

import { reactive, UnwrapRef } from "vue";
import { v4 as uuidv4 } from "uuid";

import { BaseObj } from "../common/base";
import { IModelParamProps, ModelParameter } from "./modelParameter";
// import { useModelDBStore } from "@/stores/model/modelDBStore";

export interface IModelProps {
  doc?: any;
  abbreviation?: string;
  elementType?: string;
  favorite?: boolean;
  id?: string;
  label?: string;
  params?: IModelParamProps[];
  recordables?: any[];
  version?: string;
}

export class BaseModel extends BaseObj {
  private readonly _name = "Model";

  private _abbreviation: string;
  private _doc: any; // doc data of the database
  private _elementType: string; // element type of the model
  private _favorite: boolean = false;
  private _id: string; // model id
  // private _idx: number; // generative
  private _label: string; // model label for view
  private _params: { [key: string]: ModelParameter } = {}; // model parameters
  private _paramsVisible: string[] = [];
  private _recordables: any[] = []; // recordables for multimeter
  private _state: UnwrapRef<any>;
  // private _modelDBStore;

  constructor(modelProps: IModelProps = {}, simulator?: string) {
    super({
      config: { simulator },
      logger: { settings: { minLevel: 3 } },
    });

    this._doc = modelProps;
    this._id = modelProps.id || uuidv4();

    // this._modelDBStore = useModelDBStore();
    // this._idx = this._modelDBStore.models.length;

    this._elementType = modelProps.elementType || "neuron";

    this._label = modelProps.label || "";
    this._abbreviation = modelProps.abbreviation || "";
    this._favorite = modelProps.favorite || false;

    this._state = reactive({
      selected: false,
    });

    this.update(modelProps);
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

  get favorite(): boolean {
    return this._favorite;
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
  addParameter(paramProps: IModelParamProps): void {
    this._params[paramProps.id] = new ModelParameter(this, paramProps);
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
    this.logger.trace("new parameter:", paramId);
    const param: any = {
      id: paramId,
      label: paramId,
      value,
      level: 1,
      component: "valueSlider",
      min: 0,
      max: 100,
      step: 1,
    };
    if (Array.isArray(value)) {
      param.component = "arrayInput";
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
    this.logger.trace("save");
    // return this._modelDBStore.saveModel(this._id);
  }

  /**
   * Serialize for JSON.
   * @return model props
   */
  toJSON(): IModelProps {
    const modelProps: IModelProps = {
      abbreviation: this._abbreviation,
      elementType: this._elementType,
      id: this._id,
      label: this._label,
      params: Object.values(this._params).map((param: ModelParameter) =>
        param.toJSON()
      ),
      version: process.env.APP_VERSION,
    };

    if (this._favorite) {
      modelProps.favorite = true;
    }

    // Add the recordables if provided.
    if (this._recordables.length > 0) {
      modelProps.recordables = this._recordables.map(
        (recordable: any) => recordable.id
      );
    }

    return modelProps;
  }

  /**
   * Update  a parameter.
   * @param model model object
   */
  update(model: any): void {
    this.logger.trace("update:", model.id);

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
  updateParameters(params: IModelParamProps[]): void {
    // this.logger.trace("update parameters");
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
    this._recordables = this.config?.localStorage.recordables?.filter(
      (recordable: any) => model.recordables.includes(recordable.id)
    );
  }
}
