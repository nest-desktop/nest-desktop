// synapse.ts

import { ModelParameter } from "@/helpers/model/modelParameter";
import { BaseSynapse, ISynapseProps } from "@/helpers/synapse/synapse";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";

import { NESTConnection } from "../connection/connection";
// import { NESTCopyModel } from "../model/copyModel";
import { NESTModel } from "../model/model";
import {
  INESTSynapseParamProps,
  NESTSynapseParameter,
} from "./synapseParameter";

export interface INESTSynapseProps extends ISynapseProps {
  receptorIdx?: number;
  model?: string;
  params?: INESTSynapseParamProps[];
}

export class NESTSynapse extends BaseSynapse {
  private _modelId: string;
  private _receptorIdx: number = 0;
  public _model: NESTModel;

  constructor(connection: NESTConnection, synapseProps?: INESTSynapseProps) {
    super(connection, synapseProps);

    this._modelId = synapseProps?.model || "static_synapse";

    this._model = this.getModel(this._modelId);
    this._receptorIdx = synapseProps?.receptorIdx || 0;

    this.initParameters(synapseProps?.params);
  }

  get connection(): NESTConnection {
    return this._connection as NESTConnection;
  }

  get delay(): number {
    const delay: any = this.params.delay;
    return delay ? delay.value : 1;
  }

  set delay(value: number) {
    this.params.delay.state.value = value;
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
   * Check if synapse parameter can be spatial
   * when the connection is spatial.
   */
  override get isSpatial(): boolean {
    return this.connection.isBothSpatial;
  }

  get isStatic(): boolean {
    return this.model.id === "static_synapse";
  }

  get model(): NESTModel {
    if (this._model?.id !== this.modelId) {
      this._model = this.getModel(this.modelId);
    }
    return this._model as NESTModel;
  }

  /**
   * Set model.
   *
   * @remarks
   * It initializes parameters and activity components.
   * It triggers node changes.
   *
   * @param model - synapse model
   */
  set model(model: NESTModel) {
    this._modelId = model.id;
    this._model = model;
    this.modelChanges();
  }

  get modelDBStore(): TModelDBStore {
    return this.connection.connections.network.project.modelDBStore;
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model ID.
   *
   * @remarks
   * It initializes parameters.
   *
   * @param value - ID of the model
   */
  set modelId(value: string) {
    this._modelId = value;
  }

  get modelParams(): Record<string, ModelParameter> {
    return this.model.params;
  }

  get models(): NESTModel[] {
    const elementType: string = this.model.elementType;
    const models: NESTModel[] = this.modelDBStore.getModelsByElementType(
      elementType
    ) as NESTModel[];

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
    return this.connection.targetNode.receptors?.map((_, idx: number) => idx);
  }

  override get paramsAll(): NESTSynapseParameter[] {
    return Object.values(this._params) as NESTSynapseParameter[];
  }

  override get params(): Record<string, NESTSynapseParameter> {
    return this._params as Record<string, NESTSynapseParameter>;
  }

  get showReceptorType(): boolean {
    return (
      !this.connection.sourceNode.model.isRecorder &&
      this.connection.targetNode.receptors.length > 0
    );
  }

  /**
   * Add parameter component.
   * @param paramProps - synapse parameter props
   */
  addParameter(paramProps: INESTSynapseParamProps): void {
    // this._logger.trace("add parameter:", param)
    this.params[paramProps.id] = new NESTSynapseParameter(this, paramProps);
  }

  getModel(modelId: string): NESTModel {
    this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId) as NESTModel;
  }

  /**
   * Initialize synapse parameters.
   */
  override initParameters(paramsProps?: INESTSynapseParamProps[]): void {
    this.logger.trace("init parameters");

    this._paramsVisible = [];
    this._params = {};
    if (this.model && paramsProps) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        const param = paramsProps?.find(
          (param: any) => param.id === modelParam.id
        );
        this.addParameter(param || modelParam);
        if (param && param.visible !== false) {
          this._paramsVisible.push(modelParam.id);
        }
      });
    } else if (this.model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) =>
        this.addParameter(modelParam)
      );
    } else if (paramsProps) {
      paramsProps.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits synapse changes.
   */
  modelChanges(): void {
    this.initParameters();
    this.connection.network.clean();
    this.changes();
  }

  /**
   * Serialize for JSON.
   * @return synapse props
   */
  override toJSON(): INESTSynapseProps {
    const synapseProps: INESTSynapseProps = {};

    if (this.modelId !== "static_synapse") {
      synapseProps.model = this.modelId;
    }

    if (this.filteredParams.length > 0) {
      synapseProps.params = this.filteredParams.map(
        (param: NESTSynapseParameter) => param.toJSON()
      );
    }

    if (this._receptorIdx !== 0) {
      synapseProps.receptorIdx = this._receptorIdx;
    }

    return synapseProps;
  }
}
