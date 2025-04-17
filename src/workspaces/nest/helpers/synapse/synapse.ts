// synapse.ts

import { BaseSynapse, ISynapseProps } from "@/helpers/synapse/synapse";
import { IParamProps, TParamValue } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";

import { NESTConnection } from "../connection/connection";
import { NESTCopyModel } from "../model/copyModel";
import { NESTCopyModelParameter } from "../model/copyModelParameter";
import { NESTModel } from "../model/model";
import { NESTNetwork } from "../network/network";
import { NESTSynapseParameter } from "./synapseParameter";
import { TElementType } from "@/helpers/model/model";

export interface INESTSynapseProps extends ISynapseProps {
  receptorIdx?: number;
  model?: string;
  params?: IParamProps[];
}

export class NESTSynapse extends BaseSynapse {
  private _copyModel: NESTCopyModel | undefined;
  private _receptorIdx: number = 0;
  public _model: NESTModel;

  constructor(connection: NESTConnection, synapseProps?: INESTSynapseProps) {
    super(connection, synapseProps);

    this._modelId = synapseProps?.model || "static_synapse";
    this._receptorIdx = synapseProps?.receptorIdx || 0;
  }

  get connection(): NESTConnection {
    return this._connection as NESTConnection;
  }

  get delay(): TParamValue {
    const delay: NESTSynapseParameter = this.params.delay;
    return delay ? delay.value : 1;
  }

  set delay(value: TParamValue) {
    this.params.delay.state.value = value;
  }

  get elementType(): TElementType {
    return this.model?.elementType;
  }

  /**
   * Returns all visible parameters.
   */
  override get filteredParams(): NESTSynapseParameter[] {
    return this.paramsVisible.map((paramId) => this.params[paramId]);
  }

  get hasSomeVisibleParams(): boolean {
    return this.paramsVisible.length > 0;
  }

  get hasReceptorIndices(): boolean {
    return this.receptorIndices?.length > 0;
  }

  get hasSynSpec(): boolean {
    return !this.isStatic || this.hasSomeVisibleParams;
  }

  /**
   * Check if synapse parameter can be spatial when the connection is spatial.
   */
  override get isSpatial(): boolean {
    return this.connection.isBothSpatial;
  }

  get isStatic(): boolean {
    return this.modelId === "static_synapse";
  }

  get model(): NESTModel {
    if (this._copyModel) {
      if (!this._model || this._model.id !== this._copyModel.existingModelId)
        this._model = this.getModel(this._copyModel.existingModelId);
    } else {
      if (!this._model || this._model.id !== this._modelId) this._model = this.getModel(this._modelId);
    }

    return this._model as NESTModel;
  }

  // get model(): NESTModel | NESTCopyModel {
  //   if (this._model?.id !== this.modelId) {
  //     this._model = this.getModel(this.modelId);
  //   }

  //   const network = this._connection.network as NESTNetwork;
  //   if (network.copyModels?.synapseModels.some((model: NESTCopyModel) => model.id === this.modelId)) {
  //     this._model = network.copyModels.getModel(this._modelId);
  //   } else if (this._model?.id !== this.modelId) {
  //     this._model = this.getModel(this._modelId);
  //   }

  //   return this._model;
  // }

  get copyModel(): NESTCopyModel | undefined {
    return this._copyModel;
  }

  get modelDBStore() {
    return this.connection.connections.network.project.modelDBStore;
  }

  /**
   * Get model ID.
   */
  override get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model ID.
   */
  set modelId(value: string) {
    this._modelId = value;

    this.loadModel();
    this.modelChanges();
  }

  get modelParams(): Record<string, ModelParameter | NESTCopyModelParameter> {
    return this.model.params;
  }

  // Get models of the same element type.
  get models(): NESTModel[] {
    const elementType: string = this.model?.elementType;
    const models: NESTModel[] = this.modelDBStore.getModelsByElementType(elementType) as NESTModel[];
    return models;
  }

  // Get all copied synapse models.
  get copyModels(): NESTCopyModel[] {
    return this.network.copyModels.synapseModels as NESTCopyModel[];
  }

  get network(): NESTNetwork {
    return this.connection.connections.network as NESTNetwork;
  }

  get receptorIdx(): number {
    return this._receptorIdx;
  }

  set receptorIdx(value: number) {
    this._receptorIdx = value;
  }

  get receptorIndices(): number[] {
    return this.connection.targetNode.receptors?.map((_, idx: number) => idx);
  }

  /**
   * Return whether it contains weight recorder.
   */
  get recordedByWeightRecorder(): boolean {
    if (!this.copyModel) return false;
    return this.copyModel.hasWeightRecorderParam;
  }

  override get paramsAll(): NESTSynapseParameter[] {
    return Object.values(this._params) as NESTSynapseParameter[];
  }

  override get params(): Record<string, NESTSynapseParameter> {
    return this._params as Record<string, NESTSynapseParameter>;
  }

  get showReceptorType(): boolean {
    return !this.connection.sourceNode.model.isRecorder && this.connection.targetNode.receptors.length > 0;
  }

  /**
   * Add parameter component.
   * @param paramProps parameter props
   */
  addParameter(paramProps: IParamProps, visible?: boolean): void {
    // this._logger.trace("add parameter:", param)
    this.params[paramProps.id] = new NESTSynapseParameter(this, paramProps);
    if (visible) this._paramsVisible.push(paramProps.id);
  }

  /**
   * Get synapse model.
   * @param modelId string
   * @returns NEST model object
   */
  getModel(modelId: string): NESTModel {
    this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId) as NESTModel;
  }

  /**
   * Initialize synapse.
   * @remarks Do not call it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.loadModel(this.props?.params);
    this.update();
  }

  /**
   * Initialize synapse parameters.
   */
  override initParameters(paramsProps?: IParamProps[]): void {
    this.logger.trace("init parameters");

    this.emptyParams();

    if (this._model) {
      this._model.paramsAll.forEach((modelParam: ModelParameter) => {
        if (paramsProps && paramsProps.length > 0) {
          const synapseParamProps = paramsProps.find((paramProps: IParamProps) => paramProps.id === modelParam.id);
          if (synapseParamProps) {
            this.addParameter(
              {
                ...synapseParamProps,
                ...modelParam,
              },
              true,
            );
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (paramsProps) {
      paramsProps.forEach((param: IParamProps) => this.addParameter(param, true));
    }
  }

  /**
   * Load model.
   * @param paramsProps list of param props
   * @remarks It adds parameters.
   */
  loadModel(paramsProps?: IParamProps[]): void {
    this.logger.trace("load model:", this._modelId);

    if (this.network.copyModels && this.network.copyModels.findByModelId(this._modelId)) {
      this._copyModel = this.network.copyModels.getModel(this._modelId);
      this._model = this.getModel(this._copyModel.existingModelId);
    } else {
      this._copyModel = undefined;
      this._model = this.getModel(this._modelId);
    }

    this.initParameters(paramsProps);
  }

  /**
   * Observer for model changes.
   * @remarks It emits synapse changes.
   */
  modelChanges(): void {
    this.initParameters();
    this.connection.network.clean();
    this.changes({ preventSimulation: true });
  }

  /**
   * Serialize for JSON.
   * @return synapse props
   */
  override toJSON(): INESTSynapseProps {
    const synapseProps: INESTSynapseProps = {};

    if (this.modelId !== "static_synapse") synapseProps.model = this.modelId;
    if (this.filteredParams.length > 0)
      synapseProps.params = this.filteredParams.map((param: NESTSynapseParameter) => param.toJSON());
    if (this._receptorIdx !== 0) synapseProps.receptorIdx = this._receptorIdx;

    return synapseProps;
  }
}
