// nestSynapse.ts

import { BaseSynapse, SynapseProps } from "@/helpers/synapse/baseSynapse";
import { SynapseParameter } from "@/helpers/synapse/synapseParameter";

import { NESTConnection } from "../connection/nestConnection";
// import { NESTCopyModel } from "../model/nestCopyModel";
import { NESTModel } from "../model/nestModel";

export interface NESTSynapseProps extends SynapseProps {
  receptorIdx?: number;
}

export class NESTSynapse extends BaseSynapse {
  private _receptorIdx: number = 0;

  constructor(connection: NESTConnection, synapse?: NESTSynapseProps) {
    super(connection, synapse);
    this._receptorIdx = synapse?.receptorIdx || 0;
  }

  get connection(): NESTConnection {
    return this._connection as NESTConnection;
  }

  get hasReceptorIndices(): boolean {
    return this.receptorIndices?.length > 0;
  }

  /**
   * Check if synapse parameter can be spatial
   * when the connection is spatial.
   */
  override get isSpatial(): boolean {
    return this.connection.isBothSpatial;
  }

  override get model(): NESTModel {
    if (this._model?.id !== this.modelId) {
      this._model = this.getModel(this.modelId);
    }
    return this._model as NESTModel;
  }

  override get models(): (NESTModel)[] {
    const elementType: string = this.model.elementType;
    const models: NESTModel[] =
      this.connection.network.project.modelStore.getModelsByElementType(
        elementType
      );

    // const modelsCopied: NESTCopyModel[] =
    //   this.connection.network.modelsCopied.filterByElementType(elementType);

    // const filteredModels = [...models, ...modelsCopied];
    // filteredModels.sort();

    return models;
  }

  get receptorIdx(): number {
    return this._receptorIdx;
  }

  set receptorIdx(value: number) {
    this._receptorIdx = value;
  }

  get receptorIndices(): number[] {
    return this.connection.target.receptors?.map((_, idx: number) => idx);
  }

  get showReceptorType(): boolean {
    return (
      !this.connection.source.model.isRecorder &&
      this.connection.target.receptors.length > 0
    );
  }

  override getModel(modelId: string): NESTModel {
    this.logger.trace("get model:", modelId);
    // if (
    //   this.connection.network.modelsCopied?.synapseModels.some(
    //     (model: NESTCopyModel) => model.id === modelId
    //   )
    // ) {
    //   return this.connection.network.modelsCopied.getModelById(modelId);
    // } else {
    //   return this.connection.network.project.modelStore.getModel(modelId);
    // }
    return this.connection.network.project.modelStore.getModel(modelId);
  }

  /**
   * Serialize for JSON.
   * @return synapse object
   */
  override toJSON(): NESTSynapseProps {
    const synapse: NESTSynapseProps = {};

    if (this.modelId !== "static_synapse") {
      synapse.model = this.modelId;
    }

    if (this.filteredParams.length > 0) {
      synapse.params = this.filteredParams.map((param: SynapseParameter) =>
        param.toJSON()
      );
    }

    if (this._receptorIdx !== 0) {
      synapse.receptorIdx = this._receptorIdx;
    }
    return synapse;
  }
}
