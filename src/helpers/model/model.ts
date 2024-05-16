// model.ts

import { v4 as uuidv4 } from "uuid";

import { BaseObj } from "../common/base";
import { IConfigProps } from "../common/config";
import { IDoc } from "../common/database";
import { IParamProps } from "../common/parameter";
import { INodeRecordProps } from "../node/nodeRecord";
import { IModelParamProps, ModelParameter } from "./modelParameter";

export interface IModelProps extends IDoc {
  abbreviation?: string;
  elementType?: string;
  favorite?: boolean;
  label?: string;
  params?: IModelParamProps[];
  recordables?: string[];
}

export class BaseModel extends BaseObj {
  private _abbreviation: string;
  private _doc: IModelProps; // doc data of the database
  private _elementType: string; // element type of the model
  private _favorite: boolean = false;
  private _id: string; // model id
  private _label: string; // model label for view
  private _params: { [key: string]: ModelParameter } = {}; // model parameters
  private _paramsVisible: string[] = [];
  private _recordables: INodeRecordProps[] = []; // recordables for multimeter

  constructor(modelProps: IModelProps, configProps?: IConfigProps) {
    super({
      config: { name: "Model", ...configProps },
      logger: { settings: { minLevel: 3 } },
    });

    this._doc = modelProps;
    this._id = modelProps.id || uuidv4();

    this._elementType = modelProps.elementType || "neuron";

    this._label = modelProps.label || "";
    this._abbreviation = modelProps.abbreviation || "";
    this._favorite = modelProps.favorite || false;

    this.update(modelProps);
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get doc(): IModelProps {
    return this._doc;
  }

  get docId(): string | undefined {
    return this._doc.id;
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

  get recordables(): INodeRecordProps[] {
    return this._recordables;
  }

  get value(): string {
    return this.id;
  }

  /**
   * Add a parameter to the model specifications.
   * @param paramProps parameter props
   */
  addParameter(paramProps: IModelParamProps): void {
    this._params[paramProps.id] = new ModelParameter(this, paramProps);
  }

  /**
   * Clean the model index.
   */
  clean(): void {
    // this._idx = this._modelDBStore.state.models.indexOf(this);
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
    if (Array.isArray(value)) {
      paramProps.component = "arrayInput";
    }
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
        (recordable: INodeRecordProps) => recordable.id
      );
    }

    return modelProps;
  }

  /**
   * Update  a parameter.
   * @param modelProps model object
   */
  update(modelProps: IModelProps): void {
    this.logger.trace("update:", modelProps.id);

    // Update the model ID.
    this._id = modelProps.id || uuidv4();

    // Update the model recordables.
    if (modelProps.recordables) {
      this.updateRecordables(modelProps);
    }

    // Update the model parameters.
    if (modelProps.params) {
      this.updateParameters(modelProps.params);
    }
  }

  /**
   * Update the model parameters.
   * @param modelParams model parameter props
   */
  updateParameters(modelParamsProps: IModelParamProps[]): void {
    this.logger.trace("update model parameters");

    this._params = {};
    modelParamsProps.forEach((modelParamProps: IModelParamProps) => {
      this.addParameter(modelParamProps);
    });
  }

  /**
   * Update recordables from the config.
   * @param modelProps model props
   */
  updateRecordables(modelProps: IModelProps): void {
    this._recordables = this.config?.localStorage.recordables?.filter(
      (recordable: INodeRecordProps) =>
        modelProps.recordables?.includes(recordable.id)
    );
  }
}
