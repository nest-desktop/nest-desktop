// synapse.ts

import { BaseSynapse, SynapseProps } from "@/helpers/synapse/synapse";
import { ModelParameter } from "@/helpers/model/modelParameter";

import {
  NESTSynapseParameter,
  SynapseParameterProps,
} from "./synapseParameter";
import { NESTConnection } from "../connection/connection";
// import { NESTCopyModel } from "../model/copyModel";
import { NESTModel } from "../model/model";

export interface NESTSynapseProps extends SynapseProps {
  receptorIdx?: number;
  model?: string;
  params?: SynapseParameterProps[];
}

export class NESTSynapse extends BaseSynapse {
  private _paramsVisible: string[] = [];
  private _params: { [key: string]: NESTSynapseParameter } = {};

  private _modelId: string;
  public _model: NESTModel;
  private _receptorIdx: number = 0;

  constructor(connection: NESTConnection, synapse?: NESTSynapseProps) {
    super(connection, synapse);

    this._modelId = synapse?.model || "static_synapse";
    this._model = this.getModel(this._modelId);
    this._receptorIdx = synapse?.receptorIdx || 0;

    this.initParameters(synapse?.params);
  }

  get connection(): NESTConnection {
    return this._connection as NESTConnection;
  }

  get delay(): number {
    const delay: any = this._params.delay;
    return delay ? delay.value : 1;
  }

  set delay(value: number) {
    this._params.delay.value = value;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): NESTSynapseParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
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

  get modelDBStore(): any {
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

  get modelParams(): { [key: string]: ModelParameter } {
    return this.model.params;
  }

  get models(): NESTModel[] {
    const elementType: string = this.model.elementType;
    const models: NESTModel[] =
      this.modelDBStore.getModelsByElementType(elementType);

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

  get params(): { [key: string]: NESTSynapseParameter } {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get showReceptorType(): boolean {
    return (
      !this.connection.source.model.isRecorder &&
      this.connection.target.receptors.length > 0
    );
  }

  override get weight(): number {
    let weight: any = this._params.weight;
    if (weight && !weight.visible) {
      weight = this.model.params.weight;
    }
    return weight ? weight.value : 1;
  }

  override set weight(value: number) {
    this._params.weight.value = value;
  }

  /**
   * Add model parameter component.
   * @param param - parameter object
   */
  addParameter(param: SynapseParameterProps): void {
    // this._logger.trace("add parameter:", param)
    this._params[param.id] = new NESTSynapseParameter(this, param);
  }

  getModel(modelId: string): NESTModel {
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
    return this.modelDBStore.getModel(modelId);
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this._paramsVisible = [];
  }

  /**
   * Initialize synapse parameters.
   */
  initParameters(params?: SynapseParameterProps[]): void {
    this.logger.trace("init parameters");
    this._paramsVisible = [];
    this._params = {};
    if (this.model && params) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        const param = params?.find((param: any) => param.id === modelParam.id);
        this.addParameter(param || modelParam);
        if (param && param.visible !== false) {
          this._paramsVisible.push(modelParam.id);
        }
      });
    } else if (this.model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) =>
        this.addParameter(modelParam)
      );
    } else if (params) {
      params.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.logger.trace("inverse weight");
    const weight: NESTSynapseParameter = this._params.weight;
    if (typeof weight.value === "number") {
      weight.visible = true;
      weight.value = -1 * weight.value;
      this.connection.changes();
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
   * Reset synapse parameter values.
   */
  reset(): void {
    this.filteredParams.forEach((param: NESTSynapseParameter) => param.reset());
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach(
      (param: NESTSynapseParameter) => (param.visible = true)
    );
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
      synapse.params = this.filteredParams.map((param: NESTSynapseParameter) =>
        param.toJSON()
      );
    }

    if (this._receptorIdx !== 0) {
      synapse.receptorIdx = this._receptorIdx;
    }
    return synapse;
  }
}
