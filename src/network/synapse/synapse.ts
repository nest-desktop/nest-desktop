// synapse.ts

import type { Class, TModel, TSynapseParameter } from "@/types";

import type { BaseModel, ModelParameters } from "@/model";
import type { IBaseState } from "@/core";
import { CodeNodeMask, ICodeMaskParamState } from "@/codeGraph";

import { SynapseParameters } from "./synapseParameters";
import { BaseConnection } from "../connection";

export interface ISynapseState extends IBaseState {
  model?: string;
  params?: Record<string, ICodeMaskParamState>;
}

export class BaseSynapse<
  TConnection extends BaseConnection = BaseConnection,
  TState extends ISynapseState = ISynapseState,
> extends CodeNodeMask<TState> {
  private _connection: TConnection;

  public _model: TModel | undefined;
  public _modelId: string = "static";
  public _params: SynapseParameters;

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
   * Get model.
   * @param modelId model ID
   */
  getModel(modelId: string): TModel | undefined {
    this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId);
  }

  /**
   * Initialize synapse.
   */
  init(): void {
    this.logger.trace("init");

    this.params.init();
    // this.update();
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.logger.trace("inverse weight");

    const weightParam: TSynapseParameter = this.params.weight;
    if (typeof weightParam.value === "number") {
      weightParam.hidden = false;
      weightParam.value = -1 * weightParam.value;
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
   */
  modelChanges(): void {
    this.connection.network.clean();
  }

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
}
