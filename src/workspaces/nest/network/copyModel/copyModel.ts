// copyModel.ts

import { type UnwrapRef, reactive } from "vue";

import { BaseObj, type IBaseState } from "@/core";
import { BaseParameter, type IParamState } from "@/parameter";
import type { INodeRecordState } from "@/network";

import { NESTConnection } from "../connection";
import { NESTCopyModelParameter } from "./copyModelParameter";
import { NESTCopyModels } from "./copyModels";
import { NESTModel } from "../../model";
import { NESTModelCompartmentParameter, NESTModelReceptor } from "../../model";
import { NESTNetwork } from "../network";
import { NESTNode } from "../node";
import { NESTCopyModelParameters } from "./copyModelParameters";

export interface INESTCopyModelState extends IBaseState {
  existing: string;
  new: string;
  params?: Record<string, IParamState>;
}

interface INESTCopyModelRefState {
  visible: boolean;
}

export class NESTCopyModel extends BaseObj<INESTCopyModelState> {
  private _existingModelId: string = "";
  private _copyModels: NESTCopyModels;
  private _newModelId: string = "";
  private _params: NESTCopyModelParameters;
  private _state: UnwrapRef<INESTCopyModelRefState> = reactive<INESTCopyModelRefState>({
    visible: true,
  });

  constructor(copyModels: NESTCopyModels) {
    super();

    this._copyModels = copyModels;
    this._params = new NESTCopyModelParameters(this);
  }

  get abbreviation(): string {
    return this.model?.abbreviation ?? "";
  }

  get compartmentParams(): Record<string, NESTModelCompartmentParameter> {
    return this.model?.compartmentParams ?? {};
  }

  get connections(): NESTConnection[] {
    return this.network.connections.all.filter(
      (connection: NESTConnection) => connection.synapse.modelId === this.newModelId,
    );
  }

  get copyModels(): NESTCopyModels {
    return this._copyModels;
  }

  get elementTypeGeneral(): string {
    return this.model?.elementType === "synapse" ? "synapse" : "node";
  }

  get elementType(): string {
    return this.model?.elementType ?? "";
  }

  get existingModelId(): string {
    return this._existingModelId;
  }

  /**
   * This method sets the model ID to <ID of parent model> + '_copied' to avoid naming collisions.
   * @param value New model ID
   */
  set existingModelId(value: string) {
    const renameNew = this.newModelId.includes(this._existingModelId);
    if (renameNew) this.newModelId = value + "_copied" + (this.idx + 1);
    this._existingModelId = value;

    this.params.init();
    // this.changes();
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
    return this.existingModelId === "weight_recorder";
  }

  get idx(): number {
    return this.copyModels.all.indexOf(this);
  }

  get label(): string {
    return this._newModelId;
  }

  get model(): NESTModel | undefined {
    return this.modelDBStore.findModel(this.existingModelId) as NESTModel;
  }

  get modelConfig(): Record<string, string> {
    return this.model?.config?.localStorage;
  }

  get modelDBStore() {
    return this.network.project.modelDBStore;
  }

  get models(): NESTModel[] {
    return this.modelDBStore.state.models as NESTModel[];
  }

  get network(): NESTNetwork {
    return this.copyModels.network;
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
      (connection: NESTConnection) => connection.synapse.modelId === this._newModelId,
    );
    this._newModelId = value;
    nodes.forEach((node: NESTNode) => (node.modelId = this._newModelId));
    connections.forEach((connection: NESTConnection) => (connection.synapse.modelId = this._newModelId));
  }

  get nodes(): NESTNode[] {
    return this.network.nodes.all.filter((node: NESTNode) => node.modelId === this._newModelId);
  }

  get params(): NESTCopyModelParameters {
    return this._params;
  }

  get receptors(): Record<string, NESTModelReceptor> {
    return this.model?.receptors ?? {};
  }

  get recordables(): INodeRecordState[] {
    return this.model?.recordables ?? [];
  }

  get show(): boolean {
    return this.copyModels.showModel(this) || true; // TODO
  }

  get size(): number {
    return NaN;
  }

  get state(): UnwrapRef<INESTCopyModelRefState> {
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
    return this.network.nodes.weightRecorders.find((node: NESTNode) => node.view.label === weightRecorderParam.value);
  }

  /**
   * Clean copy model.
   */
  clean(): void {
    const weightRecorderParam: NESTCopyModelParameter = this.params.weight_recorder;

    // Update weight recorder list to select.
    if (weightRecorderParam) {
      weightRecorderParam.items = this.network.nodes.weightRecorders.map((recorder: NESTNode) => recorder.view.label);
      weightRecorderParam.visible = true;
    }
  }

  /**
   * Initialize copy model.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.params.init();
  }

  // /**
  //  * Init parameter components.
  //  * @param paramStates list of parameter state
  //  */
  // initParameters(paramStates?: IParamState[]): void {
  //   this.logger.trace("Add parameters");

  //   this.emptyParams();
  //   if (this.model) {
  //     this.model.params.values.forEach((modelParam: ModelParameter) => {
  //       if (paramStates && paramStates.length > 0) {
  //         const modelParamState = paramStates.find((paramState: IParamState) => paramState.id === modelParam.id);
  //         if (modelParamState) {
  //           this.addParameter(
  //             {
  //               ...modelParamState,
  //               ...modelParam,
  //             },
  //             true,
  //           );
  //         } else {
  //           this.addParameter(modelParam);
  //         }
  //       } else {
  //         this.addParameter(modelParam);
  //       }
  //     });
  //   } else if (paramStates) {
  //     paramStates.forEach((param: IParamState) => this.addParameter(param, true));
  //   }

  //   if (this.isSynapse) {
  //     const weightRecorders = this.network.nodes.weightRecorders.map((recorder: NESTNode) => recorder.view.label);
  //     let weightRecorder: TParamValue = weightRecorders[weightRecorders.length - 1];

  //     if (paramStates) {
  //       const weightRecorderParam = paramStates.find((paramState: IParamState) => paramState.id === "weight_recorder");
  //       if (weightRecorderParam && weightRecorderParam.value) weightRecorder = weightRecorderParam.value;
  //     }

  //     this.addParameter({
  //       id: "weight_recorder",
  //       items: this.network.nodes.weightRecorders.map((recorder: NESTNode) => recorder.view.label),
  //       component: "select",
  //       label: "weight recorder",
  //       value: weightRecorder || null,
  //     });
  //   }
  // }

  isAssignedToWeightRecorder(node: NESTNode): boolean {
    const weightRecorderParam: BaseParameter = this.params.weight_recorder;
    return weightRecorderParam ? weightRecorderParam.value === node.view.label : false;
  }

  /**
   * Load copy model from state.
   * @param modelState model state
   */
  load(modelState: INESTCopyModelState): void {
    this._existingModelId = modelState.existing;
    this._newModelId = modelState.new;
    if (modelState.params) this.params.load(modelState.params);
  }

  /**
   * Delete model.
   * @remarks It removes model component of the network.
   */
  remove(): void {
    this.network.nodes.all
      .filter((node: NESTNode) => node.modelId === this.newModelId)
      .forEach((node: NESTNode) => (node.modelId = this._existingModelId));

    this.network.connections.all
      .filter((connection: NESTConnection) => connection.synapse.modelId === this.newModelId)
      .forEach((connection: NESTConnection) => (connection.synapse.modelId = this._existingModelId));

    this.network.deleteModel(this);
    this.clean();
  }

  /**
   * Save copy model to state.
   * @return copy model state
   */
  override save(): INESTCopyModelState {
    const state: INESTCopyModelState = {
      existing: this._existingModelId,
      new: this._newModelId,
    };

    if (this.params.hasSomeVisibleParams) state.params = this.params.save();

    return state;
  }
}
