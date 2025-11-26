// synapse.ts

import type { IParamState } from "@/helpers/common";
import type { TElementType } from "@/helpers/model";
import { BaseSynapse, type ISynapseState } from "@/networkGraph/helpers/synapse/synapse";

import type { NESTConnection } from "../connection/connection";
import type { NESTCopyModel } from "../model/copyModel";
import type { NESTNetwork } from "../network/network";
import type { NESTNode } from "../node/node";

export interface INESTSynapseState extends ISynapseState {
  receptorIdx?: number;
  model?: string;
  params?: Record<string, IParamState>;
}

export class NESTSynapse extends BaseSynapse<INESTSynapseState> {
  private _copyModel: NESTCopyModel | undefined;
  private _receptorIdx: number = 0;

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
    return this.targetNode.receptors?.map((_, idx: number) => idx);
  }

  /**
   * Return whether it contains weight recorder.
   */
  get recordedByWeightRecorder(): boolean {
    if (!this.copyModel) return false;
    return this.copyModel.params.hasWeightRecorderParam;
  }

  get showReceptorType(): boolean {
    return !this.connection.sourceNode.model.isRecorder && this.targetNode.receptors.length > 0;
  }

  get targetNode(): NESTNode {
    return this.connection.targetNode as NESTNode;
  }

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
    if (this.params.hasSomeVisibleParams) synapseState.params = this.params.save();
    if (this.receptorIdx !== 0) synapseState.receptorIdx = this.receptorIdx;

    return synapseState;
  }
}
