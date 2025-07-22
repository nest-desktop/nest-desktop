// synapse.ts

import { TConnection, TModel, TSynapseParameter } from "@/types";

import { BaseObj } from "../common/base";
import { BaseSynapseParameter } from "./synapseParameter";
import { IParamProps } from "../common/parameter";
import { ModelParameter } from "../model/modelParameter";

export interface ISynapseProps {
  model?: string;
  params?: IParamProps[];
}

export class BaseSynapse extends BaseObj {
  // private readonly _name = "Synapse";
  public _model: TModel | undefined;
  public _modelId: string = "static";
  public _params: Record<string, TSynapseParameter> = {};
  public _paramsVisible: string[] = [];

  public _connection: TConnection; // parent

  constructor(connection: TConnection, synapseProps?: ISynapseProps) {
    super();

    this._connection = connection;
    this.props = synapseProps as ISynapseProps;

    this._modelId = synapseProps?.model || "static";
  }

  get connection(): TConnection {
    return this._connection;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): TSynapseParameter[] {
    return this.paramsVisible.map((paramId) => this.params[paramId]);
  }

  get hasSomeVisibleParams(): boolean {
    return this.paramsVisible.length > 0;
  }

  get icon(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "network:synapse-recorder";
    } else {
      return "network:synapse-" + (this.weight > 0 ? "excitatory" : "inhibitory");
    }
  }

  /**
   * Check if synapse parameter can be spatial.
   */
  get isSpatial(): boolean {
    return false;
  }

  get model(): BaseModel {}

  get modelDBStore() {
    return this.connection.connections.network.project.modelDBStore;
  }

  get modelId(): string {
    return this.intf?.model ? this.intf.model.value : this._modelId;
  }

  set modelId(value: string) {
    if (this.intf?.model) {
      this.intf.model.value = value;
    } else {
      this._modelId = value;
    }

    this.loadModel();
  }

  get modelParams(): Record<string, ModelParameter> {
    return this.model.params;
  }

  // Get models of the same element type.
  get models(): TModel[] {
    const elementType: string = this.model?.elementType;
    const models: TModel[] = this.modelDBStore.getModelsByElementType(elementType) as TModel[];
    return models;
  }

  get paramsAll(): TSynapseParameter[] {
    return Object.values(this.params);
  }

  get params(): Record<string, TSynapseParameter> {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.onUpdate({ preventSimulation: true });
  }

  get weight(): number {
    const weight: TSynapseParameter = this.params.weight;
    return weight ? (weight.value as number) : 1;
  }

  set weight(value: number) {
    this.params.weight.state.value = value;
    this.onUpdate({ checkSynWeights: true });
  }

  get weightColor(): string {
    if (this.connection.view.connectRecorder() || this.weight === 0) {
      return "grey";
    } else {
      return this.weight > 0 ? "blue" : "red";
    }
  }

  get weightLabel(): string {
    return this.weight === 0 ? "" : this.weight > 0 ? "excitatory" : "inhibitory";
  }

  set weightLabel(value: string) {
    this.weight = (value === "inhibitory" ? -1 : 1) * Math.abs(this.weight as number);
    this.params.weight.visible = this.weight != 1;
  }

  /**
   * Add parameter component.
   * @param paramProps- synapse parameter props
   */
  addParameter(paramProps: IParamProps): void {
    this.logger.trace("add parameter:", paramProps);
    this._params[paramProps.id] = new BaseSynapseParameter(this, paramProps);
  }

  /**
   * Empty parameters
   */
  emptyParams(): void {
    this._params = {};
    this._paramsVisible = [];
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
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this._paramsVisible = [];
  }

  /**
   * Initialize synapse.
   */
  init(): void {
    this.logger.trace("init");

    this.loadModel(this.props.params);
    this.update();
  }

  /**
   * Initialize synapse parameters.
   */
  initParameters(paramsProps?: IParamProps[]): void {
    this.logger.trace("init parameters");

    this.emptyParams();

    if (paramsProps) paramsProps.forEach((param: IParamProps) => this.addParameter(param));
  }

  /**
   * Inverse synaptic weight.
   */
  inverseWeight(): void {
    this.logger.trace("inverse weight");

    const weight: TSynapseParameter = this._params.weight;
    if (typeof weight.value === "number") {
      weight.visible = true;
      weight.state.value = -1 * weight.value;
      this.onUpdate({ preventSimulation: true });
    }
  }

  /**
   * Load model.
   */
  loadModel(paramsProps?: IParamProps[]): void {
    this.logger.trace("load model:", this.modelId);

    this._model = this.getModel(this.modelId);
    this.initParameters(paramsProps);
    // this.onModelUpdate();
  }

  /**
   * Observer for model changes.
   * @remarks It emits node changes.
   * @remarks It corrects connection direction to the recorder.
   * @remarks It updates as analog recorder or other connected analog recorders.
   */
  onModelUpdate(): void {
    this.logger.trace("on model update");

    this.update();
    this.codeNode?.onModelUpdate();
    this.codeNodes.params?.onModelUpdate();
    // this.connection.connections.network.onUpdate({ preventSimulation: true, cleanPanels: recorderModelChanged });
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  onUpdate(props = {}): void {
    this.logger.trace("on update");

    this.updateHash();
    this.connection.onUpdate({ checkSynWeights: true, ...props });
  }

  /**
   * Reset synapse parameter values.
   */
  reset(): void {
    this.filteredParams.forEach((param: TSynapseParameter) => param.reset());
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this.params).forEach((param: TSynapseParameter) => (param.visible = true));
  }

  /**
   * Serialize for JSON.
   * @return synapse props
   */
  toJSON(): ISynapseProps {
    const synapseProps: ISynapseProps = {};

    if (this.filteredParams.length > 0)
      synapseProps.params = this.filteredParams.map((param: TSynapseParameter) => param.toJSON());

    return synapseProps;
  }

  /**
   * Update synapse.
   */
  update(): void {
    this.updateHash();
  }

  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
