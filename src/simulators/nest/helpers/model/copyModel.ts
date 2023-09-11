// copyModel.ts

import { reactive, UnwrapRef } from "vue";
import { Parameter } from "@/helpers/common/parameter";
import {
  ModelParameter,
  ModelParameterProps,
} from "@/helpers/model/modelParameter";

import { NESTConnection } from "../connection/connection";
import { NESTNetwork } from "../network/network";
import { NESTNode } from "../node/node";

import { NESTModel } from "./model";
import { NESTModelCompartmentParameter } from "./modelCompartmentParameter";
import { NESTModelReceptor } from "./modelReceptor/modelReceptor";

export interface NESTCopyModelProps {
  existing: string;
  new: string;
  params?: ModelParameterProps[];
}

interface NESTCopyModelState {
  visible: boolean;
}

export class NESTCopyModel {
  private readonly _name = "CopyModel";

  private _existingModelId: string;
  private _idx: number;
  private _network: NESTNetwork;
  private _newModelId: string;
  private _params: { [key: string]: ModelParameter } = {};
  private _paramsVisible: string[] = [];
  private _state: UnwrapRef<NESTCopyModelState>;

  constructor(
    network: NESTNetwork,
    model: NESTCopyModelProps = { existing: "", new: "" }
  ) {
    this._network = network;
    this._existingModelId = model.existing;
    this._newModelId = model.new;

    this._idx = this.network.modelsCopied.length;
    this._state = reactive({
      visible: true,
    });

    this.initParameters(model);
  }

  get abbreviation(): string {
    return this.model.abbreviation;
  }

  get config(): { [key: string]: string } {
    return this.model.config;
  }

  get compartmentParams(): { [key: string]: NESTModelCompartmentParameter } {
    return this.model.compartmentParams;
  }

  get connections(): NESTConnection[] {
    return this._network.connections.all.filter(
      (connection: NESTConnection) =>
        connection.synapse.modelId === this._newModelId
    );
  }

  get elementType(): string {
    return this.model.elementType;
  }

  get existingModelId(): string {
    return this._existingModelId;
  }

  /**
   * This method sets the model ID to <ID of parent model> + '_copied' to avoid
   * naming collisions.
   * @param value New model ID
   */
  set existingModelId(value: string) {
    const renameNew = this.newModelId.includes(this._existingModelId);
    this._existingModelId = value;
    if (renameNew) {
      this.newModelId = value + "_copied" + (this._idx + 1);
    }
    this.initParameters();
    this.changes();
  }

  // get hasSomeVisibleParams(): boolean {
  //   return Object.values(this._params).some(
  //     (param: ModelParameter) => param.visible
  //   );
  // }

  get hasWeightRecorderParam(): boolean {
    return "weight_recorder" in this._params;
  }

  get id(): string {
    return this._newModelId;
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
    return this._existingModelId === "multimeter";
  }

  /**
   * Check if the model is a neuron.
   */
  get isNeuron(): boolean {
    return this.elementType === "neuron";
  }

  /**
   * Check if the model is a recorder.
   */
  get isRecorder(): boolean {
    return this.elementType === "recorder";
  }

  /**
   * Check if the model is a spike recorder.
   */
  get isSpikeRecorder(): boolean {
    return this._existingModelId === "spike_recorder";
  }

  /**
   * Check if the model is a stimulator.
   */
  get isStimulator(): boolean {
    return this.elementType === "stimulator";
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
    return this._existingModelId === "weight_recorder";
  }

  get idx(): number {
    return this._idx;
  }

  get filteredParams(): ModelParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  /**
   * Check if model has params.
   */
  get hasParameters(): boolean {
    return Object.keys(this._params).length > 0;
  }

  get label(): string {
    return this._newModelId;
  }

  get model(): NESTModel {
    return this._network.project.modelStore.getModel(this._existingModelId);
  }

  get models(): NESTModel[] {
    return this._network.project.modelStore.models as NESTModel[];
  }

  get name(): string {
    return this._name;
  }

  get network(): NESTNetwork {
    return this._network;
  }

  get newModelId(): string {
    return this._newModelId;
  }

  /**
   * Sets the new model ID to `value` and updates all nodes and connections.
   * @param value New model ID
   */
  set newModelId(value: string) {
    const nodes = this.nodes;
    const connections = this._network.connections.all.filter(
      (connection: NESTConnection) =>
        connection.synapse.modelId === this._newModelId
    );
    this._newModelId = value;
    nodes.forEach((node: NESTNode) => (node.modelId = this._newModelId));
    connections.forEach(
      (connection: NESTConnection) =>
        (connection.synapse.modelId = this._newModelId)
    );
  }

  get nodes(): NESTNode[] {
    return this._network.nodes.all.filter(
      (node: NESTNode) => node.modelId === this._newModelId
    );
  }

  get params(): { [key: string]: ModelParameter } {
    return this._params;
  }

  set params(values: { [key: string]: ModelParameter }) {
    this._params = { ...this._params, ...values };
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

  get receptors(): { [key: string]: NESTModelReceptor } {
    return this.model.receptors;
  }

  get recordables(): any[] {
    return this.model.recordables;
  }

  get size(): number {
    return NaN;
  }

  get state(): UnwrapRef<NESTCopyModelState> {
    return this._state;
  }

  get view(): { color: string } {
    return { color: "black" };
  }

  get weightRecorder(): NESTNode | undefined {
    if (!this.hasWeightRecorderParam) {
      return new NESTNode(this._network.nodes);
    }

    // Get weight recorder parameter.
    const weightRecorderParam = this._params.weight_recorder;

    // Return weight recorder node.
    return this._network.nodes.weightRecorders.find(
      (node: NESTNode) => node.view.label === weightRecorderParam.value
    );
  }

  /**
   * Add model parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params[param.id] = new ModelParameter(this.model, param);
  }

  // /**
  //  * Add parameter component.
  //  * @param param - parameter object
  //  */
  // addParameter(param: any): void {
  //   const parameter = new Parameter(this, param);
  //   parameter.visible = true;
  //   this._params.push(parameter);
  // }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addWeightRecorderParameter(param: any): void {
    this.addParameter({
      id: "weight_recorder",
      variant: "select",
      label: "weight recorder",
      items: this._network.nodes.weightRecorders.map(
        (recorder: NESTNode) => recorder.view.label
      ),
      value: param.value,
      visible: true,
    });
  }

  clean(): void {
    this._idx = this._network.modelsCopied.all.indexOf(this);

    const weightRecorderParam: any = this._params.weight_recorder;

    // Update weight recorder list to select.
    if (weightRecorderParam) {
      weightRecorderParam.items = this._network.nodes.weightRecorders.map(
        (recorder: NESTNode) => recorder.view.label
      );
    }
  }

  // /**
  //  * Sets all params to invisible.
  //  */
  hideAllParams(): void {
    this.paramsAll.forEach((param: ModelParameter) => (param.visible = false));
  }

  /**
   * Initialize parameter components.
   * @param model - model object
   */
  initParameters(model: any = null): void {
    // Update parameters from model
    this._params = {};
    if (this.model && model && "params" in model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        const param = model.params.find((p: any) => p.id === modelParam.id);
        this.addParameter(param || modelParam.toJSON());
      });
    } else if (this.model) {
      Object.values(this.model.params).forEach((param: ModelParameter) =>
        this.addParameter(param.toJSON())
      );
    } else if ("params" in model) {
      model.params.forEach((param: any) => this.addParameter(param));
    }

    if (this.model.isSynapse) {
      const weightRecorders = this._network.nodes.weightRecorders.map(
        (recorder: NESTNode) => recorder.view.label
      );
      let weightRecorder: string = weightRecorders[weightRecorders.length - 1];

      if (model && "params" in model) {
        const weightRecorderParam = model.params.find(
          (param: Parameter) => param.id === "weight_recorder"
        );
        if (weightRecorderParam) {
          weightRecorder = weightRecorderParam.value;
        }
      }

      if (weightRecorder) {
        this.addWeightRecorderParameter({
          value: weightRecorder,
        });
      }
    }
  }

  isAssignedToWeightRecorder(node: NESTNode): boolean {
    const weightRecorderParam: Parameter = this._params.weight_recorder;
    return weightRecorderParam
      ? weightRecorderParam.value === node.view.label
      : false;
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this._network.changes();
  }

  /**
   * Delete model.
   *
   * @remarks
   * It removes model component of the network.
   */
  remove(): void {
    this._network.nodes.all
      .filter((node: NESTNode) => node.modelId === this.newModelId)
      .forEach((node: NESTNode) => (node.modelId = this._existingModelId));

    this._network.connections.all
      .filter(
        (connection: NESTConnection) =>
          connection.synapse.modelId === this.newModelId
      )
      .forEach(
        (connection: NESTConnection) =>
          (connection.synapse.modelId = this._existingModelId)
      );

    this._network.deleteModel(this);
    this.clean();
  }

  // /**
  //  * Sets all params to visible.
  //  */
  showAllParams(): void {
    this.paramsAll.forEach((param: ModelParameter) => (param.visible = true));
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): NESTCopyModelProps {
    return {
      existing: this._existingModelId,
      new: this._newModelId,
      params: this.filteredParams.map((param: ModelParameter) =>
        param.toJSON()
      ),
    };
  }
}
