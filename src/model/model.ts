// model.ts

import { type UnwrapRef, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";

import type { IParamState } from "@/parameter";
import type { TProject } from "@/types";
import { BaseObj, type IConfigState, type IDoc } from "@/core";

import { ModelParameters } from "./helpers/modelParameters";

export interface IModelState extends IDoc {
  custom?: boolean;
  abbreviation?: string;
  elementType?: TElementType;
  favorite?: boolean;
  id?: string;
  label?: string;
  params?: Record<string, IParamState>;
  recordables?: (IModelRecordState | string)[];
  states?: (IModelRecordState | string)[];
}

export interface IModelRecordState {
  id: string;
  label?: string;
  unit?: string;
}

interface IBaseModelRefState {
  custom: boolean;
  label: string;
}

export type TNodeElementType = "neuron" | "recorder" | "stimulator";
export type TSynapseElementType = "synapse";
export type TElementType = TNodeElementType | TSynapseElementType;

export class BaseModel<T extends IModelState = IModelState> extends BaseObj<T> {
  private _abbreviation: string;
  private _doc: IModelState; // doc data of the database
  private _elementType: TElementType; // element type of the model
  private _favorite: boolean = false;
  private _id: string; // model id
  private _params: ModelParameters;
  private _project: TProject | undefined;
  private _state: UnwrapRef<IBaseModelRefState>;
  private _states: IModelRecordState[] = [];

  constructor(modelState: IModelState = {}, configState?: IConfigState) {
    super({ config: { name: "Model", ...configState } });

    this._doc = modelState;
    this._id = modelState.id || uuidv4().slice(0, 6);
    this._elementType = modelState.elementType || "neuron";

    this._abbreviation = modelState.abbreviation || "";
    this._favorite = modelState.favorite || false;

    this._state = reactive<IBaseModelRefState>({
      custom: modelState.custom ?? false,
      label: modelState.label || "",
    });

    this._params = new ModelParameters(this);

    this.load(modelState);
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get doc(): IModelState {
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

  // get hashObject(): IBaseState {
  //   return {
  //     label: this.state.label,
  //     states: this.states,
  //     params: this.params.hash,
  //   };
  // }

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
    return this.state.label;
  }

  get params(): ModelParameters {
    return this._params;
  }

  get project(): TProject | undefined {
    return this._project;
  }

  set project(value: TProject) {
    this._project = value;
  }

  get recordables(): IModelRecordState[] {
    return this._states;
  }

  get state(): UnwrapRef<IBaseModelRefState> {
    return this._state;
  }

  get states(): IModelRecordState[] {
    return this._states;
  }

  get value(): string {
    return this.id;
  }

  /**
   * Get variable name.
   * @remarks for select component
   */
  get variableName(): string {
    let name: string;
    switch (this.elementType) {
      case "neuron":
        name = "n";
        break;
      case undefined:
        name = "n";
        break;
      default:
        name = this.abbreviation;
    }

    return name;
  }

  /**
   * Clean the model.
   */
  clean(): void {
    // this.params.clean()
    // this._idx = this._modelDBStore.state.models.indexOf(this);
  }

  changes(props?: Record<string, unknown>): void {
    // console.log("model changes:", props);
  }

  /**
   * Load model from state.
   * @param modelState model state
   */
  load(modelState: IModelState): void {
    this.logger.trace("update:", modelState.id);

    // Update the model ID.
    this._id = modelState.id || uuidv4();

    // Update the model recordables or states.
    if (modelState.recordables) {
      this.updateRecordStates(modelState.recordables);
    } else if (modelState.states) {
      this.updateRecordStates(modelState.states);
    }

    // Update the model parameters.
    if (modelState.params) this.params.load(modelState.params);

    // this.updateHash();
  }

  /**
   * Save model to state.
   * @return model state
   */
  override save(): IModelState {
    const modelState: IModelState = {
      abbreviation: this._abbreviation,
      elementType: this._elementType,
      id: this._id,
      label: this.state.label,
      params: this.params.save(),
      version: process.env.APP_VERSION,
    };

    if (this._favorite) modelState.favorite = true;

    // Add model states if provided.
    if (this.states.length > 0) modelState.states = this.states.map((state: IModelRecordState | string) => state);

    return modelState;
  }

  /**
   * Update model record states.
   * @param recordStates record states
   */
  updateRecordStates(recordStates: (IModelRecordState | string)[]): void {
    this._states = recordStates.map((recordState: IModelRecordState | string) =>
      recordState instanceof Object
        ? recordState
        : this.config?.localStorage.states.find((state: IModelRecordState) => state.id === recordState),
    );
  }
}
