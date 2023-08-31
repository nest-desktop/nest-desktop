// synapse.ts

import { ILogObj, Logger } from "tslog";
import { logger as mainLogger } from "@/utils/logger";

import { Connection } from "../connection/connection";
import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import { ModelParameter } from "../model/modelParameter";
import { SynapseParameter, SynapseParameterProps } from "./synapseParameter";
import { UnwrapRef, reactive } from "vue";

interface SynapseState {
  hash: string;
}

export interface SynapseProps {
  model?: string;
  params?: SynapseParameterProps[];
  receptorIdx?: number;
}

export class Synapse {
  private readonly _name = "Synapse";
  private _connection: Connection; // parent
  private _logger: Logger<ILogObj>;
  private _model: CopyModel | Model;
  private _modelId: string;
  private _paramsVisible: string[] = [];
  private _params: { [key: string]: SynapseParameter } = {};
  private _receptorIdx: number = 0;
  private _state: UnwrapRef<SynapseState>;

  constructor(connection: Connection, synapse?: SynapseProps) {
    this._connection = connection;
    this._modelId = synapse?.model || "static_synapse";
    this._receptorIdx = synapse?.receptorIdx || 0;

    this._logger = mainLogger.getSubLogger({
      name: `[${this._modelId}] synapse`,
    });

    this._state = reactive({
      hash: "",
    });

    this._model = this.getModel(this._modelId);
    this.initParameters(synapse?.params);
  }

  get connection(): Connection {
    return this._connection;
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
  get filteredParams(): SynapseParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hasReceptorIndices(): boolean {
    return this.receptorIndices.length > 0;
  }

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
  }

  get hasSynSpec(): boolean {
    return !this.isStatic || this.hasSomeVisibleParams;
  }

  get icon(): string {
    if (this._connection.view.connectRecorder() || this.weight === 0) {
      return "nest:synapse-recorder";
    } else {
      return "nest:synapse-" + (this.weight > 0 ? "excitatory" : "inhibitory");
    }
  }

  get isStatic(): boolean {
    return this.model.id === "static_synapse";
  }

  get model(): CopyModel | Model {
    if (this._model?.id !== this._modelId) {
      this._model = this.getModel(this._modelId);
    }
    return this._model;
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
  set model(model: CopyModel | Model) {
    this._modelId = model.id;
    this._model = model;
    this.modelChanges();
  }

  get models(): (CopyModel | Model)[] {
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this._connection.network.project.modelStore.getModelsByElementType(
        elementType
      );
    const modelsCopied: CopyModel[] =
      this._connection.network.models.filterByElementType(elementType);
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
  }

  get modelParams(): { [key: string]: ModelParameter } {
    return this.model.params;
  }

  get name(): string {
    return this._name;
  }

  get params(): { [key: string]: SynapseParameter } {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
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

  get showReceptorType(): boolean {
    return (
      !this._connection.source.model.isRecorder &&
      this._connection.target.receptors.length > 0
    );
  }

  get state(): UnwrapRef<SynapseState> {
    return this._state;
  }

  get weight(): number {
    let weight: any = this._params.weight;
    if (weight && !weight.visible) {
      weight = this.model.params.weight;
    }
    return weight ? weight.value : 1;
  }

  // set weight(value: number) {
  //   this._params.weight.value = value;
  // }

  get weightColor(): string {
    if (this._connection.view.connectRecorder() || this.weight === 0) {
      return "grey";
    } else {
      return this.weight > 0 ? "blue" : "red";
    }
  }

  get weightLabel(): string {
    return this.weight === 0
      ? ""
      : this.weight > 0
      ? "excitatory"
      : "inhibitory";
  }

  set weightLabel(value: string) {
    const weight: SynapseParameter = this.params.weight;
    weight.visible = true;
    weight.value =
      (value === "inhibitory" ? -1 : 1) * Math.abs(weight.value as number);
  }

  /**
   * Add model parameter component.
   * @param param - parameter object
   */
  addParameter(param: SynapseParameterProps): void {
    // this._logger.trace("add parameter:", param)
    this._params[param.id] = new SynapseParameter(this, param);
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  changes(): void {
    // this.updateHash()
    this._connection.changes();
  }

  getModel(modelId: string): CopyModel | Model {
    this._logger.trace("get model:", modelId);
    if (
      this._connection.network.models.synapseModels.some(
        (model: CopyModel) => model.id === modelId
      )
    ) {
      return this._connection.network.models.getModelById(modelId);
    } else {
      return this._connection.network.project.modelStore.getModel(modelId);
    }
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
    this._logger.trace("init parameters");
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
    this._logger.trace("inverse weight");
    const weight: SynapseParameter = this._params.weight;
    if (typeof weight.value === "number") {
      weight.visible = true;
      weight.value = -1 * weight.value;
      this._connection.changes();
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
    this._connection.network.clean();
    this.changes();
  }

  reset(): void {
    this.filteredParams.forEach((param: SynapseParameter) => param.reset());
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach(
      (param: SynapseParameter) => (param.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return synapse object
   */
  toJSON(): SynapseProps {
    const synapse: SynapseProps = {};

    if (this._modelId !== "static_synapse") {
      synapse.model = this._modelId;
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