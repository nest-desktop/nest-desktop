// model.ts

import { v4 as uuidv4 } from "uuid";

import { BaseModel, type IModelState, type IModelRecordState, type TElementType } from "@/helpers/model/model";
import type { IParamState } from "@/helpers/common";
import { ModelParameter } from "@/helpers/model";

import {
  type INESTModelReceptorState,
  NESTModelReceptor,
} from "../../networkGraph/helpers/model/modelReceptor/modelReceptor";
import { NESTModelCompartmentParameter } from "./modelCompartmentParameter";
// import { loadText } from "@/utils/fetch";

export interface INESTModelState extends IModelState {
  compartmentParams?: IParamState[];
  receptors?: INESTModelReceptorState[];
  nestmlScript?: string;
  templateName?: string;
}

export class NESTModel extends BaseModel<INESTModelState> {
  private _compartmentParams: Record<string, NESTModelCompartmentParameter> = {}; // model compartmental parameters
  private _compartmentParamsVisible: string[] = [];
  private _custom: boolean = false;
  private _nestmlScript: string = "";
  private _receptors: Record<string, NESTModelReceptor> = {}; // receptor parameters
  private _templateName: string = "iaf_psc_alpha_neuron";

  constructor(modelState: INESTModelState = {}) {
    super(modelState, { name: "NESTModel", workspace: "nest" });

    if (modelState.nestmlScript) this._nestmlScript = modelState.nestmlScript;
    if (modelState.templateName) this._templateName = modelState.templateName;
    if (modelState.custom) this._custom = modelState.custom;
  }

  get compartmentParams(): Record<string, NESTModelCompartmentParameter> {
    return this._compartmentParams;
  }

  get compartmentParamsVisible(): string[] {
    return this._compartmentParamsVisible;
  }

  set compartmentParamsVisible(values: string[]) {
    this._compartmentParamsVisible = values;
    this.changes();
  }

  get custom(): boolean {
    return this._custom;
  }

  get existing(): string {
    return this.id;
  }

  /**
   * Check if the model is a synapse.
   */
  get isSynapse(): boolean {
    return this.elementType === "synapse";
  }

  /**
   * Check if the model is a weight recorder.
   */
  get isWeightRecorder(): boolean {
    return this.id === "weight_recorder";
  }

  get nestmlScript(): string {
    return this._nestmlScript;
  }

  set nestmlScript(value: string) {
    this._nestmlScript = value;
  }

  get receptors(): Record<string, NESTModelReceptor> {
    return this._receptors;
  }

  get templateName(): string {
    return this._templateName;
  }

  set templateName(value: string) {
    this._templateName = value;
  }

  get weightRecorder(): boolean {
    return false;
  }

  /**
   * Add a compartment parameter to the model specifications.
   * @param param parameter state
   */
  addCompartmentParameter(param: IParamState): void {
    this._compartmentParams[param.id] = new NESTModelCompartmentParameter(this, param);
  }

  /**
   * Get parameter defaults of a model from NEST Simulator.
   */
  // async fetchDefaults(): Promise<AxiosResponse<any,any>> {
  //   return this._app.backends.nestSimulator.instance.post("api/GetDefaults", {
  //     model: this._id,
  //   });
  // }

  /**
   * Get the parameter of the model compartment.
   * @param paramId ID of the searched parameter
   */
  getCompartmentParameter(paramId: string): NESTModelCompartmentParameter {
    return this._compartmentParams[paramId];
  }

  /**
   * Load model from state.
   * @param model NEST model state
   */
  override load(modelState: INESTModelState): void {
    this.logger.trace("update", modelState.id);

    // Update the model ID.
    this.id = modelState.id || uuidv4();

    // Update the model recordables or states.
    if (modelState.recordables) {
      this.updateRecordStates(modelState.recordables);
    } else if (modelState.states) {
      this.updateRecordStates(modelState.states);
    }

    // Update the model parameters.
    if (modelState.params) {
      this.updateParameters(modelState.params);
    }

    // Update the model compartment parameters.
    if (modelState.compartmentParams) {
      this.updateCompartmentParameters(modelState.compartmentParams);
    }

    // Update the model receptors.
    if (modelState.receptors) {
      this.updateReceptors(modelState.receptors);
    }

    this.updateHash();
  }

  /**
   * Replace model id, also in NESTML script.
   * @param modelLabel string
   */
  replaceModelId(modelLabel: string): void {
    if (this._templateName.length > 0) {
      const elementType = this._templateName.split("_").pop() as TElementType;
      if (["neuron", "synapse"].includes(elementType)) this.elementType = elementType;
    }

    let modelId = modelLabel.trimEnd().replaceAll(" ", "_");
    if (!modelId.endsWith("_neuron") && !modelId.endsWith("_synapse")) {
      modelId += "_" + this.elementType;
    }
    this.id = modelId;

    if (this.nestmlScript.length > 0) {
      // Replace model in NESTML script
      const regex = /model\s\S+/gm;
      this.nestmlScript = this.nestmlScript.replace(regex, `model ${this.id}:`);
    }
  }

  /**
   * Save model to state.
   * @return NEST model state
   */
  override save(): INESTModelState {
    const modelState: INESTModelState = {
      elementType: this.elementType,
      id: this.id,
      label: this.state.label,
      params: Object.values(this.params).map((param: ModelParameter) => param.save()),
      version: process.env.APP_VERSION,
    };

    if (this.abbreviation) modelState.abbreviation = this.abbreviation;
    if (this.custom) modelState.custom = this.custom;

    // Add the states if provided.
    if (this.states.length > 0) modelState.states = this.states.map((state: IModelRecordState) => state);

    // Add the compartment parameters if provided.
    if (this._compartmentParamsVisible.length > 0)
      modelState.compartmentParams = Object.values(this._compartmentParams).map(
        (param: NESTModelCompartmentParameter) => param.save(),
      );

    // Add the receptors if provided.
    if (Object.keys(this._receptors).length > 0)
      modelState.receptors = Object.values(this._receptors).map((receptor: NESTModelReceptor) => receptor.save());

    // Add NESTML script if provided.
    if (this._nestmlScript) modelState.nestmlScript = this._nestmlScript;
    if (this._templateName) modelState.templateName = this._templateName;

    return modelState;
  }

  /**
   * Update model compartment parameters.
   * @param compartmentParamStates compartmental model states
   */
  updateCompartmentParameters(compartmentParamStates: IParamState[]): void {
    this._compartmentParams = {};
    Object.values(compartmentParamStates).forEach((paramState: IParamState) => {
      this.addCompartmentParameter(paramState);
    });
  }

  /**
   * Update the compartment parameter.
   * @param paramState parameter state
   */
  updateCompartmentParameter(paramState: IParamState): void {
    this._compartmentParams[paramState.id] = new NESTModelCompartmentParameter(this, paramState);
  }

  /**
   * Update the model receptors.
   * @param receptorStates model states
   */
  updateReceptors(receptorStates: INESTModelReceptorState[]): void {
    this._receptors = {};
    Object.values(receptorStates).forEach((receptorState: INESTModelReceptorState) => {
      this._receptors[receptorState.id] = new NESTModelReceptor(this, receptorState);
    });
  }
}
