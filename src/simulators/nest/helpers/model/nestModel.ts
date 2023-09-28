// nestModel.ts

import { ModelParameter } from "@/helpers/model/modelParameter";

import {
  NESTModelCompartmentParameterProps,
  NESTModelCompartmentParameter,
} from "./nestModelCompartmentParameter";
import { NESTModelReceptor } from "./modelReceptor/nestModelReceptor";
import { BaseModel, ModelProps } from "@/helpers/model/baseModel";

export interface NESTModelProps extends ModelProps {
  compartmentalParams?: any[];
  receptors?: any[];
}

export class NESTModel extends BaseModel {
  private _compartmentParams: { [key: string]: NESTModelCompartmentParameter } = {}; // model compartmental parameters
  private _compartmentParamsVisible: string[] = [];
  private _receptors: { [key: string]: NESTModelReceptor } = {}; // receptor parameters

  constructor(model: ModelProps = {}) {
    super(model, "NESTModel");
  }

  get compartmentParams(): { [key: string]: NESTModelCompartmentParameter } {
    return this._compartmentParams;
  }

  get compartmentParamsVisible(): string[] {
    return this._compartmentParamsVisible;
  }

  set compartmentParamsVisible(values: string[]) {
    this._compartmentParamsVisible = values;
    this.changes();
  }

  get existing(): string {
    return this.id;
  }

  get hasWeightRecorderParam(): boolean {
    return false;
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

  get receptors(): { [key: string]: NESTModelReceptor } {
    return this._receptors;
  }

  get weightRecorder(): boolean {
    return false;
  }

  /**
   * Add a compartment parameter to the model specifications.
   * @param param parameter object
   */
  addCompartmentParameter(param: NESTModelCompartmentParameterProps): void {
    this._compartmentParams[param.id] = new NESTModelCompartmentParameter(
      this,
      param
    );
  }

  /**
   * Clone this model object.
   */
  override clone(): NESTModel {
    return new NESTModel({ ...this.toJSON() });
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
   * Get the parameter of the model compartment.
   * @param paramId ID of the searched parameter
   */
  getCompartmentParameter(paramId: string): NESTModelCompartmentParameter {
    return this._compartmentParams[paramId];
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  override toJSON(): ModelProps {
    const model: any = {
      abbreviation: this.abbreviation,
      elementType: this.elementType,
      id: this.id,
      label: this.label,
      params: Object.values(this.params).map((param: ModelParameter) =>
        param.toJSON()
      ),
      version: process.env.APP_VERSION,
    };

    // Add the recordables if provided.
    if (this.recordables.length > 0) {
      model.recordables = this.recordables.map(
        (recordable: any) => recordable.id
      );
    }

    // Add the compartment parameters if provided.
    if (this._compartmentParams) {
      model.compartmentParams = Object.values(this._compartmentParams).map(
        (param: NESTModelCompartmentParameter) => param.toJSON()
      );
    }

    // Add the receptors if provided.
    if (this._receptors) {
      model.receptors = Object.values(this._receptors).map(
        (receptor: NESTModelReceptor) => receptor.toJSON()
      );
    }

    return model;
  }

  /**
   * Update  a parameter.
   * @param model model object
   */
  override update(model: any): void {
    this.logger.trace("update");

    // Update the model ID.
    this.id = model.id;

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
   * Update model compartment parameters.
   * @param model model object
   */
  updateCompartmentParameters(compartmentParams: any): void {
    this._compartmentParams = {};
    Object.values(compartmentParams).forEach((param: any) => {
      this.addCompartmentParameter(param);
    });
  }

  /**
   * Update the compartment parameter.
   * @param param parameter object
   */
  updateCompartmentParameter(param: any): void {
    this._compartmentParams[param.id] = new NESTModelCompartmentParameter(
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
    Object.values(receptors).forEach((receptor: any) => {
      this._receptors[receptor.id] = new NESTModelReceptor(this, receptor);
    });
  }
}
