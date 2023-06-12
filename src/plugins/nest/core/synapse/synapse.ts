// synapse.ts

import { Connection } from "../connection/connection";
import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import { ModelParameter } from "../model/modelParameter";
import { SynapseParameter } from "./synapseParameter";

export class Synapse {
  private readonly _name = "Synapse";
  private _connection: Connection; // parent
  private _modelId: string;
  private _params: { [key: string]: SynapseParameter } = {};
  private _receptorIdx: number = 0;

  constructor(connection: any, synapse: any = {}) {
    this._connection = connection;

    if (synapse != null && "params" in synapse && synapse.params.length > 0) {
      this._modelId = synapse.model || "static_synapse";
      this._receptorIdx = synapse.receptorIdx || 0;
      this.initParameters(synapse);
    } else {
      this._modelId = "static_synapse";
      this.initParameters();
    }
  }

  get connection(): Connection {
    return this._connection;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): SynapseParameter[] {
    return Object.values(this._params).filter(
      (param: SynapseParameter) => param.state.visible
    );
  }

  get hasReceptorIndices(): boolean {
    return this.receptorIndices.length > 0;
  }

  get hasSomeVisibleParams(): boolean {
    return  Object.values(this._params).some((param: SynapseParameter) => param.state.visible);
  }

  get hasSynSpec(): boolean {
    return !this.isStatic || this.hasSomeVisibleParams;
  }

  get isStatic(): boolean {
    return this.model.id === "static_synapse";
  }

  get model(): CopyModel | Model {
    if (
      this._connection.network.models.synapseModels.some(
        (model: CopyModel) => model.id === this.modelId
      )
    ) {
      return this._connection.network.models.getModelById(this._modelId);
    } else {
      return this._connection.network.project.modelStore.getModel(
        this._modelId
      );
    }
  }

  /**
   * Set model.
   *
   * @remarks
   * Save model ID, see modelId.
   *
   * @param model - synapse model
   */
  set model(model: CopyModel | Model) {
    this.modelId = model.id;
  }

  get models(): (CopyModel | Model)[] {
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this._connection.network.project.modelStore.filterModels(elementType);
    const modelsCopied: CopyModel[] =
      this._connection.network.filterModels(elementType);
    const filteredModels = [...models, ...modelsCopied];
    filteredModels.sort();
    return filteredModels;
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
    this.initParameters();
    this._connection.network.clean();
    this.synapseChanges();
  }

  get name(): string {
    return this._name;
  }

  get receptorIdx(): number {
    return this._receptorIdx;
  }

  set receptorIdx(value: number) {
    this._receptorIdx = value;
  }

  get receptorIndices(): number[] {
    return this.connection.target.receptors.map((_, idx: number) => idx);
  }

  get params(): { [key: string]: SynapseParameter } {
    return this._params;
  }

  get showReceptorType(): boolean {
    return (
      !this._connection.source.model.isRecorder &&
      this._connection.target.receptors.length > 0
    );
  }

  get someParams(): boolean {
    return Object.values(this._params).some((param: SynapseParameter) => param.state.visible);
  }

  get weight(): number {
    let weight: any = this._params.weight;
    if (!weight.state.visible) {
      weight = this.model.params.weight;
    }
    return weight ? weight.value : 1;
  }

  set weight(value: number) {
    this._params.weight.value = value;
  }

  get delay(): number {
    const delay: any = this._params.delay;
    return delay ? delay.value : 1;
  }

  set delay(value: number) {
    this._params.delay.value = value;
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  synapseChanges(): void {
    this._connection.connectionChanges();
  }

  /**
   * Initialize synapse parameters.
   */
  initParameters(synapse: any = null): void {
    // Update parameters from model or node.
    this._params = {};
    if (this.model && synapse && "params" in synapse) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        const param = synapse.params.find(
          (param: any) => param.id === modelParam.id
        );
        this.addParameter(param || modelParam);
      });
    } else if (this.model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) =>
        this.addParameter(modelParam)
      );
    } else if ("params" in synapse) {
      synapse.params.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Add model parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params[param.id] = new SynapseParameter(this, param);
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach(
      (param: SynapseParameter) => (param.state.visible = true)
    );
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    Object.values(this.params).forEach(
      (param: SynapseParameter) => (param.state.visible = false)
    );
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    const weight: SynapseParameter = this._params.weight;
    weight.state.visible = true;
    weight.value = -1 * weight.value;
    this._connection.connectionChanges();
  }

  /**
   * Serialize for JSON.
   * @return synapse object
   */
  toJSON(): any {
    const synapse: any = {
      model: this._modelId,
      params: Object.values(this._params).map((param: SynapseParameter) =>
        param.toJSON()
      ),
    };
    if (this._receptorIdx !== 0) {
      synapse.receptorIdx = this._receptorIdx;
    }
    return synapse;
  }
}
