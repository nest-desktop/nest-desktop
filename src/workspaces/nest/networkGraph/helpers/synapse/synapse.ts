// synapse.ts

import type { IParamState } from "@/helpers/common";
import type { TElementType } from "@/helpers/model";
import { BaseSynapse, type ISynapseState } from "@/networkGraph/helpers/synapse/synapse";

import type { NESTConnection } from "../connection/connection";
import type { NESTCopyModel } from "../model/copyModel";
// import type { NESTCopyModelParameter } from "../model/copyModelParameter";
// import type { NESTModel } from "../model/model";
import type { NESTNetwork } from "../network/network";

export interface INESTSynapseState extends ISynapseState {
  receptorIdx?: number;
  model?: string;
  params?: Record<string, IParamState>;
}

export class NESTSynapse extends BaseSynapse<INESTSynapseState> {
  private _copyModel: NESTCopyModel | undefined;
  private _receptorIdx: number = 0;

  // constructor(connection: NESTConnection) {
  //   super(connection);

  //   // this._modelId = synapseState?.model || "static_synapse";
  //   // this._receptorIdx = synapseState?.receptorIdx || 0;
  // }

  get connection(): NESTConnection {
    return this._connection as NESTConnection;
  }

  get elementType(): TElementType {
    return this.model?.elementType;
  }

  get hasReceptorIndices(): boolean {
    return this.receptorIndices?.length > 0;
  }

  get hasSynSpec(): boolean {
    return !this.isStatic || this.params.hasSomeVisibleParams;
  }

  /**
   * Check if synapse parameter can be spatial when the connection is spatial.
   */
  get isSpatial(): boolean {
    return this.connection.isBothSpatial;
  }

  get isStatic(): boolean {
    return this.modelId === "static_synapse";
  }

  // get model(): NESTModel {
  //   if (this._copyModel) {
  //     if (!this._model || this._model.id !== this._copyModel.existingModelId)
  //       this._model = this.getModel(this._copyModel.existingModelId);
  //   } else {
  //     if (!this._model || this._model.id !== this._modelId) this._model = this.getModel(this._modelId);
  //   }

  //   return this._model as NESTModel;
  // }

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

  // get modelDBStore() {
  //   return this.connection.connections.network.project.modelDBStore;
  // }

  // /**
  //  * Get model ID.
  //  */
  // override get modelId(): string {
  //   return this._modelId;
  // }

  // /**
  //  * Set model ID.
  //  */
  // set modelId(value: string) {
  //   this._modelId = value;

  //   this.loadModel();
  //   this.modelChanges();
  // }

  // get modelParams(): Record<string, ModelParameter | NESTCopyModelParameter> {
  //   return this.model.params;
  // }

  // // Get models of the same element type.
  // get models(): NESTModel[] {
  //   const elementType: string = this.model?.elementType;
  //   const models: NESTModel[] = this.modelDBStore.getModelsByElementType(elementType) as NESTModel[];
  //   return models;
  // }

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

  // override get paramsAll(): NESTSynapseParameter[] {
  //   return Object.values(this._params) as NESTSynapseParameter[];
  // }

  // override get params(): Record<string, NESTSynapseParameter> {
  //   return this._params as Record<string, NESTSynapseParameter>;
  // }

  get showReceptorType(): boolean {
    return !this.connection.sourceNode.model.isRecorder && this.connection.targetNode.receptors.length > 0;
  }

  // /**
  //  * Add parameter component.
  //  * @param paramState parameter state
  //  */
  // addParameter(paramState: IParamState, visible?: boolean): void {
  //   // this._logger.trace("add parameter:", param)
  //   this.params[paramState.id] = new NESTSynapseParameter(this, paramState);
  //   if (visible) this._paramsVisible.push(paramState.id);
  // }

  // /**
  //  * Get synapse model.
  //  * @param modelId string
  //  * @returns NEST model instance
  //  */
  // getModel(modelId: string): NESTModel {
  //   this.logger.trace("get model:", modelId);

  //   return this.modelDBStore.findModel(modelId) as NESTModel;
  // }

  /**
   * Initialize synapse.
   * @remarks Do not call it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.update();
  }

  // /**
  //  * Initialize synapse parameters.
  //  */
  // override initParameters(paramState?: Record<string, IParamState>): void {
  //   this.logger.trace("init parameters");

  //   this.emptyParams();

  //   if (this._model) {
  //     this._model.paramsAll.forEach((modelParam: ModelParameter) => {
  //       if (paramState && paramState[modelParam.id]) {
  //         const synapseParamState = paramState[modelParam.id];
  //         if (synapseParamState) {
  //           this.addParameter(
  //             {
  //               ...synapseParamState,
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
  //   } else if (paramState) {
  //     paramState.forEach((param: IParamState) => this.addParameter(param, true));
  //   }
  // }

  /**
   * Load synapse model.
   * @param modelId model ID
   */
  override loadModel(modelId: string): void {
    this.logger.trace("load model:", modelId);

    if (this.network.copyModels && this.network.copyModels.findByModelId(modelId)) {
      this._copyModel = this.network.copyModels.getModel(modelId);
      this._model = this.getModel(this._copyModel.existingModelId);
    } else {
      this._copyModel = undefined;
      this._model = this.getModel(modelId);
    }
  }

  /**
   * Save nest synapse to state.
   * @return nest synapse state
   */
  override save(): INESTSynapseState {
    const synapseState: INESTSynapseState = {};

    if (this.modelId !== "static_synapse") synapseState.model = this.modelId;
    if (this.params.filteredParams.length > 0) synapseState.params = this.params.save();
    if (this.receptorIdx !== 0) synapseState.receptorIdx = this.receptorIdx;

    return synapseState;
  }
}
