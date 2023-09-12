// synapse.ts

import { UnwrapRef, reactive } from "vue";
import { ILogObj, Logger } from "tslog";

import { Connection } from "@/types/connectionTypes";
import { Model } from "@/types/modelTypes";
import { ModelParameter } from "@/helpers/model/modelParameter";
import {
  SynapseParameter,
  SynapseParameterProps,
} from "@/helpers/synapse/synapseParameter";
import { logger as mainLogger } from "@/helpers/common/logger";

interface SynapseState {
  hash: string;
}

export interface SynapseProps {
  model?: string;
  params?: SynapseParameterProps[];
}

export class BaseSynapse {
  private readonly _name = "Synapse";
  private _logger: Logger<ILogObj>;
  private _modelId: string;
  private _paramsVisible: string[] = [];
  private _params: { [key: string]: SynapseParameter } = {};
  private _state: UnwrapRef<SynapseState>;

  public _connection: Connection; // parent
  public _model: Model;

  constructor(connection: Connection, synapse?: SynapseProps) {
    this._connection = connection;
    this._modelId = synapse?.model || "static_synapse";

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

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
  }

  get hasSynSpec(): boolean {
    return !this.isStatic || this.hasSomeVisibleParams;
  }

  get icon(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "network:synapse-recorder";
    } else {
      return (
        "network:synapse-" + (this.weight > 0 ? "excitatory" : "inhibitory")
      );
    }
  }

  /**
   * Check if synapse parameter can be spatial.
   */
  get isSpatial(): boolean {
    return false;
  }

  get isStatic(): boolean {
    return this.model.id === "static_synapse";
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get model(): Model {
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
  set model(model: Model) {
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

  get models(): Model[] {
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this.modelDBStore.getModelsByElementType(elementType);
    return models;
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
    if (this.connection.view.connectRecorder() || this.weight === 0) {
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
    this.connection.changes();
  }

  getModel(modelId: string): Model {
    this._logger.trace("get model:", modelId);
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

    return synapse;
  }
}
