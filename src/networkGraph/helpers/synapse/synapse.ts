// synapse.ts

import type { Class, TConnection, TModel, TSynapseParameter } from "@/types";

import { CodeNodeMask } from "@/codeGraph/helpers/codeNodeMask";
import type { IBaseState, IParamState } from "@/helpers/common";

import { SynapseParameters } from "./synapseParameters";
import type { BaseModel } from "@/helpers/model";
import type { ModelParameters } from "@/helpers/model/modelParameters";
import { updateNESTCreateNode } from "@/codeGraph/codeNodeTypes/nest/nestCreate";
import { updateNESTConnectNode, updateNESTConnectSynapseNode } from "@/codeGraph/codeNodeTypes/nest/nestConnect";

export interface ISynapseState extends IBaseState {
  model?: string;
  params?: Record<string, IParamState>;
}

export class BaseSynapse<T extends ISynapseState = ISynapseState> extends CodeNodeMask<T> {
  public _model: TModel | undefined;
  public _modelId: string = "static";
  public _params: SynapseParameters;

  public _connection: TConnection; // parent

  constructor(connection: TConnection) {
    super();
    this._connection = connection;

    this._params = new this.Parameters(this);
  }

  get Parameters(): Class<SynapseParameters> {
    return SynapseParameters;
  }

  get connection(): TConnection {
    return this._connection;
  }

  get icon(): string {
    const weightValue = this.params.weightValue;
    if (this.connection.view.connectRecorder() || weightValue === 0) {
      return "graph:synapse-recorder";
    } else {
      return "graph:synapse-" + (weightValue > 0 ? "excitatory" : "inhibitory");
    }
  }

  get isStatic(): boolean {
    return this.modelId === "static";
  }

  get model(): BaseModel {
    if (this._model?.id !== this._modelId) this._model = this.getModel(this._modelId);
    return this._model as BaseModel;
  }

  get modelDBStore() {
    return this.connection.connections.network.project.modelDBStore;
  }

  get modelId(): string {
    return this._modelId;
  }

  set modelId(value: string) {
    this.loadModel(value);
    this.modelChanges();
  }

  get modelParams(): ModelParameters {
    return this.model.params;
  }

  // Get models of the same element type.
  get models(): BaseModel[] {
    const elementType: string = this.model?.elementType;
    const models: BaseModel[] = this.modelDBStore.getModelsByElementType(elementType) as BaseModel[];
    return models;
  }

  get params(): SynapseParameters {
    return this._params;
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  changes(props = {}): void {
    this.logger.trace("changes");

    this.updateHash();
    this.connection.changes({ checkSynWeights: true, ...props });
  }

  /**
   * Get model.
   * @param modelId model ID
   */
  getModel(modelId: string): TModel | undefined {
    this.logger.debug("get model:", modelId);

    return this.modelDBStore.findModel(modelId);
  }

  /**
   * Initialize synapse.
   */
  init(): void {
    this.logger.trace("init");

    this.params.init();

    this.update();
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.logger.trace("inverse weight");

    const weightParam: TSynapseParameter = this.params.weight;
    if (typeof weightParam.value === "number") {
      weightParam.visible = true;
      weightParam.value = -1 * weightParam.value;
      this.changes({ preventSimulation: true });
    }
  }

  /**
   * Load synapse from state.
   * @param synapseState synapse state
   */
  load(synapseState: ISynapseState): void {
    if (synapseState.model) this.loadModel(synapseState.model);
    this.params.load(synapseState.params);
  }

  /**
   * Load model.
   * @param modelId model ID
   */
  loadModel(modelId: string): void {
    this.logger.trace("load model:", modelId);

    this._modelId = modelId;
    this._model = this.getModel(modelId);
    this.params.load(this.model.params.save());
  }

  /**
   * Observer for model changes.
   * @remarks It emits synapse changes.
   */
  modelChanges(): void {
    console.log(this.save())

    if (this.codeNode) {
      const engine = this.codeNode.code.engine;
      engine.pause();
      updateNESTConnectSynapseNode(this.codeNode, this.save());
      engine.resume();
      engine.runOnce();
    }

    this.connection.network.clean();
    this.changes({ preventSimulation: true });
  }

  registerCodeNode(): void {}

  /**
   * Reset synapse.
   */
  reset(): void {
    this.params.reset();
  }

  /**
   * Save synapse to state.
   * @return synapse state
   */
  override save(): ISynapseState {
    const synapseState: ISynapseState = {};

    if (this.modelId !== "static") synapseState.model = this.modelId;
    if (this.params.filteredParams.length > 0) synapseState.params = this.params.save();

    return synapseState;
  }

  /**
   * Update synapse.
   */
  update(): void {
    this.updateHash();
  }
}
