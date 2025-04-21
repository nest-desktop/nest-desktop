// model.ts

import { UnwrapRef, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";

import { TProject } from "@/types";

import { BaseObj } from "../common/base";
import { IConfigProps } from "../common/config";
import { IDoc } from "../common/database";
import { IParamProps } from "../common/parameter";
import { ModelParameter } from "./modelParameter";

export interface IModelProps extends IDoc {
  id?: string;
  abbreviation?: string;
  elementType?: TElementType;
  favorite?: boolean;
  label?: string;
  params?: IParamProps[];
  recordables?: (IModelStateProps | string)[];
  states?: (IModelStateProps | string)[];
}

export interface IModelStateProps {
  id: string;
  label?: string;
  unit?: string;
}

interface IBaseModelState {
  custom: boolean;
  label: string;
  paramsVisible: string[];
}

export type TElementType = "neuron" | "recorder" | "stimulator" | "synapse";

export class BaseModel extends BaseObj {
  private _abbreviation: string;
  private _doc: IModelProps; // doc data of the database
  private _elementType: TElementType; // element type of the model
  private _favorite: boolean = false;
  private _id: string; // model id
  private _params: Record<string, ModelParameter> = {}; // model parameters
  private _project: TProject | undefined;
  private _state: UnwrapRef<IBaseModelState>;
  private _states: IModelStateProps[] = [];

  constructor(modelProps: IModelProps = {}, configProps?: IConfigProps) {
    super({
      config: { name: "Model", ...configProps },
    });

    this._doc = modelProps;
    this._id = modelProps.id || uuidv4().slice(0, 6);
    this._elementType = modelProps.elementType || "neuron";

    this._abbreviation = modelProps.abbreviation || "";
    this._favorite = modelProps.favorite || false;

    this._state = reactive<IBaseModelState>({
      custom: false,
      label: modelProps.label || "",
      paramsVisible: [],
    });

    this.update(modelProps);
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get doc(): IModelProps {
    return this._doc;
  }

  get docId(): string | undefined {
    return this._doc._id;
  }

  get elementType(): TElementType {
    return this._elementType;
  }

  set elementType(value: TElementType) {
    this._elementType = value;
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
   * Get model label
   * @remarks for select component
   */
  get label(): string {
    return this._state.label;
  }

  get params(): Record<string, ModelParameter> {
    return this._params;
  }

  get paramsAll(): ModelParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._state.paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._state.paramsVisible = values;
  }

  get project(): TProject | undefined {
    return this._project;
  }

  set project(value: TProject) {
    this._project = value;
  }

  get recordables(): IModelStateProps[] {
    return this._states;
  }

  get state(): UnwrapRef<IBaseModelState> {
    return this._state;
  }

  get states(): IModelStateProps[] {
    return this._states;
  }

  get value(): string {
    return this.id;
  }

  /**
   * Add a parameter to the model specifications.
   * @param paramProps parameter props
   */
  addParameter(paramProps: IParamProps): void {
    this._params[paramProps.id] = new ModelParameter(this, paramProps);
  }

  /**
   * Clean the model index.
   */
  clean(): void {
    // this._idx = this._modelDBStore.state.models.indexOf(this);
  }

  /**
   * Empty params.
   */
  emptyParams(): void {
    this._state.paramsVisible = [];
    this._params = {};
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

  changes(): void {}

  /**
   * Create new parameter.
   * @param paramId ID of the parameter
   * @param value parameter value
   */
  newParameter(paramId: string, value: number | number[]): void {
    this.logger.trace("new parameter:", paramId);

    const paramProps: IParamProps = {
      component: "valueSlider",
      id: paramId,
      label: paramId,
      max: 100,
      min: 0,
      step: 1,
      value,
    };
    if (Array.isArray(value)) paramProps.component = "arrayInput";

    this.addParameter(paramProps);
    // this._params.sort();
  }

  /**
   * Remove a parameter.
   * @param paramId parameter ID
   */
  removeParameter(paramId: string): void {
    delete this._params[paramId];
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
      label: this.state.label,
      params: Object.values(this._params).map((param: ModelParameter) => param.toJSON()),
      version: process.env.APP_VERSION,
    };

    if (this._favorite) modelProps.favorite = true;

    // Add model states if provided.
    if (this.states.length > 0) modelProps.states = this.states.map((state: IModelStateProps | string) => state);

    return modelProps;
  }

  /**
   * Update model.
   * @param modelProps model props
   */
  update(modelProps: IModelProps): void {
    this.logger.trace("update:", modelProps.id);

    // Update the model ID.
    this._id = modelProps.id || uuidv4();

    // Update the model recordables or states.
    if (modelProps.recordables) {
      this.updateStates(modelProps.recordables);
    } else if (modelProps.states) {
      this.updateStates(modelProps.states);
    }

    // Update the model parameters.
    if (modelProps.params) this.updateParameters(modelProps.params);

    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      label: this.state.label,
      states: this.states,
      params: this.paramsAll.map((param: ModelParameter) => param.hash),
    });
  }

  /**
   * Update the model parameters.
   * @param modelParams parameter props
   */
  updateParameters(modelParamsProps: IParamProps[]): void {
    this.logger.trace("update model parameters");

    this._params = {};
    modelParamsProps.forEach((modelParamProps: IParamProps) => this.addParameter(modelParamProps));
  }

  /**
   * Update model states.
   * @param statesProps list of model state props or string
   */
  updateStates(statesProps: (IModelStateProps | string)[]): void {
    this._states = statesProps.map((stateProps: IModelStateProps | string) =>
      stateProps instanceof Object
        ? stateProps
        : this.config?.localStorage.states.find((state: IModelStateProps) => state.id === stateProps),
    );
  }
}
