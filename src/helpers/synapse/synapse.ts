// synapse.ts

import { TConnection, TSynapseParameter } from "@/types";

import { BaseObj } from "../common/base";
import { BaseSynapseParameter } from "./synapseParameter";
import { IParamProps } from "../common/parameter";

export interface ISynapseProps {
  model?: string;
  params?: IParamProps[];
}

export class BaseSynapse extends BaseObj {
  // private readonly _name = "Synapse";
  public _modelId: string = "static";
  public _params: Record<string, TSynapseParameter> = {};
  public _paramsVisible: string[] = [];
  private _props: ISynapseProps; // raw data of props

  public _connection: TConnection; // parent

  constructor(connection: TConnection, synapseProps?: ISynapseProps) {
    super();

    this._connection = connection;
    this._props = synapseProps;

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

  get modelId(): string {
    return this._modelId;
  }

  // get name(): string {
  //   return this._name;
  // }

  get paramsAll(): TSynapseParameter[] {
    return Object.values(this._params);
  }

  get params(): Record<string, TSynapseParameter> {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes({ preventSimulation: true });
  }

  get props(): ISynapseProps {
    return this._props;
  }

  get weight(): number {
    const weight: TSynapseParameter = this.params.weight;
    return weight ? (weight.value as number) : 1;
  }

  set weight(value: number) {
    this.params.weight.state.value = value;
    this.changes({ checkSynWeights: true });
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
    // this._logger.trace("add parameter:", param)
    this._params[paramProps.id] = new BaseSynapseParameter(this, paramProps);
  }

  /**
   * Observer for synapse changes.
   *
   * @remarks
   * It emits connection changes.
   */
  changes(props = {}): void {
    this.logger.trace("changes");

    this.updateHash();
    this.connection.changes({ checkSynWeights: true, ...props });
  }

  /**
   * Empty parameters
   */
  emptyParams(): void {
    this._params = {};
    this._paramsVisible = [];
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
      this.changes({ preventSimulation: true });
    }
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
