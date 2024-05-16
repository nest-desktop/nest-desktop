// copyModel.ts

import { StateTree, Store } from "pinia";
import { reactive, UnwrapRef } from "vue";

import { INodeRecordProps } from "@/helpers/node/nodeRecord";
import {
  IModelParamProps,
  ModelParameter,
} from "@/helpers/model/modelParameter";
import {
  IParamProps,
  Parameter,
  TParamValue,
} from "@/helpers/common/parameter";

import { NESTConnection } from "../connection/connection";
import { NESTModel } from "./model";
import { NESTModelCompartmentParameter } from "./modelCompartmentParameter";
import { NESTModelReceptor } from "./modelReceptor/modelReceptor";
import { NESTNetwork } from "../network/network";
import { NESTNode } from "../node/node";
import { NESTCopyModels } from "./copyModels";

export interface INESTCopyModelProps {
  existing: string;
  new: string;
  params?: IModelParamProps[];
}

interface INESTCopyModelState {
  visible: boolean;
}

export class NESTCopyModel {
  private _existingModelId: string;
  private _copyModels: NESTCopyModels;
  private _newModelId: string;
  private _params: { [key: string]: ModelParameter } = {};
  private _paramsVisible: string[] = [];
  private _state: UnwrapRef<INESTCopyModelState>;

  constructor(
    copyModels: NESTCopyModels,
    modelProps: INESTCopyModelProps = { existing: "", new: "" }
  ) {
    this._copyModels = copyModels;
    this._existingModelId = modelProps.existing;
    this._newModelId = modelProps.new;

    this._state = reactive({
      visible: true,
    });

    this.initParameters(modelProps);
  }

  get abbreviation(): string {
    return this.model.abbreviation;
  }

  get config(): { [key: string]: string } {
    return this.model.config?.localStorage;
  }

  get compartmentParams(): { [key: string]: NESTModelCompartmentParameter } {
    return this.model.compartmentParams;
  }

  get connections(): NESTConnection[] {
    return this.network.connections.all.filter(
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
      this.newModelId = value + "_copied" + (this.idx + 1);
    }
    this.initParameters();
    this.changes();
  }

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
  }

  get copyModels(): NESTCopyModels {
    return this._copyModels;
  }

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
   * Check if the model is a node.
   */
  get isNode(): boolean {
    return ["neuron", "recorder", "stimulator"].includes(this.elementType);
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
    return this._copyModels.all.indexOf(this);
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
    return this.modelDBStore.getModel(this._existingModelId);
  }

  get modelDBStore(): Store<string, StateTree> {
    return this.network.project.modelDBStore;
  }

  get models(): NESTModel[] {
    return this.modelDBStore.state.models as NESTModel[];
  }

  get network(): NESTNetwork {
    return this._copyModels.network;
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
    const connections = this.network.connections.all.filter(
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
    return this.network.nodes.nodeItems.filter(
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

  get recordables(): INodeRecordProps[] {
    return this.model.recordables;
  }

  get show(): boolean {
    return this._copyModels.showModel(this) || true; // TODO
  }

  get size(): number {
    return NaN;
  }

  get state(): UnwrapRef<INESTCopyModelState> {
    return this._state;
  }

  get view(): { color: string } {
    return { color: "black" };
  }

  get weightRecorder(): NESTNode | undefined {
    if (!this.hasWeightRecorderParam) {
      return new NESTNode(this.network.nodes);
    }

    // Get weight recorder parameter.
    const weightRecorderParam = this._params.weight_recorder;

    // Return weight recorder node.
    return this.network.nodes.weightRecorders.find(
      (node: NESTNode) => node.view.label === weightRecorderParam.value
    );
  }

  /**
   * Add model parameter component.
   * @param paramProps - parameter props
   */
  addParameter(paramProps: IParamProps): void {
    this._params[paramProps.id] = new ModelParameter(this.model, paramProps);
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addWeightRecorderParameter(param: { value: TParamValue }): void {
    this.addParameter({
      id: "weight_recorder",
      items: this.network.nodes.weightRecorders.map(
        (recorder: NESTNode) => recorder.view.label
      ),
      component: "select",
      label: "weight recorder",
      value: param.value,
      visible: true,
    });
  }

  clean(): void {
    const weightRecorderParam: ModelParameter = this._params.weight_recorder;

    // Update weight recorder list to select.
    if (weightRecorderParam) {
      weightRecorderParam.items = this.network.nodes.weightRecorders.map(
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
  initParameters(modelProps?: INESTCopyModelProps): void {
    // Update parameters from model
    this._params = {};
    if (this.model && modelProps && "params" in modelProps) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        const param = modelProps.params?.find(
          (paramProps: IParamProps) => paramProps.id === modelParam.id
        );
        this.addParameter(param || modelParam.toJSON());
      });
    } else if (this.model) {
      Object.values(this.model.params).forEach((param: ModelParameter) =>
        this.addParameter(param.toJSON())
      );
    } else if (modelProps && "params" in modelProps) {
      modelProps.params?.forEach((paramProps: IParamProps) =>
        this.addParameter(paramProps)
      );
    }

    if (this.isSynapse) {
      const weightRecorders = this.network.nodes.weightRecorders.map(
        (recorder: NESTNode) => recorder.view.label
      );
      let weightRecorder: TParamValue =
        weightRecorders[weightRecorders.length - 1];

      if (modelProps && "params" in modelProps) {
        const weightRecorderParam = modelProps.params?.find(
          (paramProps: IParamProps) => paramProps.id === "weight_recorder"
        );
        if (weightRecorderParam && weightRecorderParam.value) {
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
    this.network.changes();
  }

  /**
   * Delete model.
   *
   * @remarks
   * It removes model component of the network.
   */
  remove(): void {
    this.network.nodes.nodeItems
      .filter((node: NESTNode) => node.modelId === this.newModelId)
      .forEach((node: NESTNode) => (node.modelId = this._existingModelId));

    this.network.connections.all
      .filter(
        (connection: NESTConnection) =>
          connection.synapse.modelId === this.newModelId
      )
      .forEach(
        (connection: NESTConnection) =>
          (connection.synapse.modelId = this._existingModelId)
      );

    this.network.deleteModel(this);
    this.clean();
  }

  /**
   * Reset all parameters.
   */
  resetParams(): void {
    this.paramsAll.forEach((param: ModelParameter) => param.reset());
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsAll.forEach((param: ModelParameter) => (param.visible = true));
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): INESTCopyModelProps {
    return {
      existing: this._existingModelId,
      new: this._newModelId,
      params: this.filteredParams.map((param: ModelParameter) =>
        param.toJSON()
      ),
    };
  }
}
