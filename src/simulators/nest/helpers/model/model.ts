// model.ts

import { v4 as uuidv4 } from "uuid";

import { IParamProps } from "@/helpers/common/parameter";
import { BaseModel, IModelProps } from "@/helpers/model/model";
import { ModelParameter } from "@/helpers/model/modelParameter";
import { INodeRecordProps } from "@/helpers/node/nodeRecord";

import {
  INESTModelCompartmentParamProps,
  NESTModelCompartmentParameter,
} from "./modelCompartmentParameter";
import {
  INESTModelReceptorProps,
  NESTModelReceptor,
} from "./modelReceptor/modelReceptor";

export interface INESTModelProps extends IModelProps {
  compartmentParams?: IParamProps[];
  receptors?: INESTModelReceptorProps[];
  nestmlScript?: string;
}

export class NESTModel extends BaseModel {
  private _compartmentParams: Record<string, NESTModelCompartmentParameter> =
    {}; // model compartmental parameters
  private _compartmentParamsVisible: string[] = [];
  private _nestmlScript: string = "";
  private _receptors: Record<string, NESTModelReceptor> = {}; // receptor parameters

  constructor(modelProps: INESTModelProps = {}) {
    super(modelProps, { name: "NESTModel", simulator: "nest" });
    this.nestmlScript = modelProps.nestmlScript || "";
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

  get nestmlScript(): string {
    return this._nestmlScript;
  }

  set nestmlScript(value: string) {
    this._nestmlScript = value;
    this.custom = this._nestmlScript.length > 0;
  }

  get receptors(): Record<string, NESTModelReceptor> {
    return this._receptors;
  }

  get weightRecorder(): boolean {
    return false;
  }

  /**
   * Add a compartment parameter to the model specifications.
   * @param param parameter props
   */
  addCompartmentParameter(param: INESTModelCompartmentParamProps): void {
    this._compartmentParams[param.id] = new NESTModelCompartmentParameter(
      this,
      param
    );
  }

  /**
   * Clone NEST model object.
   */
  override clone(): NESTModel {
    return new NESTModel({ ...this.toJSON() });
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
   * Serialize for JSON.
   * @return NEST model props
   */
  override toJSON(): INESTModelProps {
    const modelProps: INESTModelProps = {
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
      modelProps.recordables = this.recordables.map(
        (recordable: INodeRecordProps) => recordable.id
      );
    }

    // Add the compartment parameters if provided.
    if (this._compartmentParams) {
      modelProps.compartmentParams = Object.values(this._compartmentParams).map(
        (param: NESTModelCompartmentParameter) => param.toJSON()
      );
    }

    // Add the receptors if provided.
    if (this._receptors) {
      modelProps.receptors = Object.values(this._receptors).map(
        (receptor: NESTModelReceptor) => receptor.toJSON()
      );
    }

    // Add NESTML script if provided.
    if (this._nestmlScript) {
      modelProps.nestmlScript = this._nestmlScript;
    }

    return modelProps;
  }

  /**
   * Update  a parameter.
   * @param model NEST model props
   */
  override update(modelProps: INESTModelProps): void {
    this.logger.trace("update", modelProps.id);

    // Update the model ID.
    this.id = modelProps.id || uuidv4();

    // Update the model recordables.
    if (modelProps.recordables) {
      this.updateRecordables(modelProps);
    }

    // Update the model parameters.
    if (modelProps.params) {
      this.updateParameters(modelProps.params);
    }

    // Update the model compartment parameters.
    if (modelProps.compartmentParams) {
      this.updateCompartmentParameters(modelProps.compartmentParams);
    }

    // Update the model receptors.
    if (modelProps.receptors) {
      this.updateReceptors(modelProps.receptors);
    }
  }

  /**
   * Update model compartment parameters.
   * @param compartmentParamsProps compartmental model props
   */
  updateCompartmentParameters(compartmentParamsProps: IParamProps[]): void {
    this._compartmentParams = {};
    Object.values(compartmentParamsProps).forEach((paramProps: IParamProps) => {
      this.addCompartmentParameter(paramProps);
    });
  }

  /**
   * Update the compartment parameter.
   * @param paramProps parameter props
   */
  updateCompartmentParameter(paramProps: IParamProps): void {
    this._compartmentParams[paramProps.id] = new NESTModelCompartmentParameter(
      this,
      paramProps
    );
  }

  /**
   * Update the model receptors.
   * @param receptorsProps model props
   */
  updateReceptors(receptorsProps: INESTModelReceptorProps[]): void {
    this._receptors = {};
    Object.values(receptorsProps).forEach(
      (receptorProps: INESTModelReceptorProps) => {
        this._receptors[receptorProps.id] = new NESTModelReceptor(
          this,
          receptorProps
        );
      }
    );
  }
}
