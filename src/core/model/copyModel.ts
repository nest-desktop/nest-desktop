import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { ModelParameter } from '../parameter/modelParameter';
import { Node } from '../node/node';
import { Network } from '../network/network';
import { Parameter } from '../parameter/parameter';

export class CopyModel {
  private readonly _name = 'CopyModel';

  private _network: Network;
  private _existing: string;
  private _idx: number;
  private _new: string;
  private _params: ModelParameter[];
  private _state: {
    visible: boolean;
  };

  constructor(network: Network, model: any = {}) {
    this._network = network;
    this._existing = model.existing;
    this._new = model.new;
    this._idx = this.network.models.length;
    this._state = {
      visible: true,
    };

    this.initParameters(model);
  }

  get abbreviation(): any {
    return this.model.abbreviation;
  }

  get config(): any {
    return this.model.config;
  }

  get connections(): Connection[] {
    return this._network.connections.filter(
      (connection: Connection) => connection.synapse.modelId === this._new
    );
  }

  get elementType(): string {
    return this.model.elementType;
  }

  get existing(): string {
    return this._existing;
  }

  set existing(value: string) {
    const renameNew = this.new.includes(this._existing);
    this._existing = value;
    if (renameNew) {
      this.new = value + '_copied' + (this._idx + 1);
    }
    this.initParameters();
    this.modelChanges();
  }

  get hasSomeVisibleParams(): boolean {
    return this._params.some((param: ModelParameter) => param.visible);
  }

  get hasWeightRecorderParam(): boolean {
    return this._params.some(
      (param: Parameter) => param.id === 'weight_recorder'
    );
  }

  get id(): string {
    return this._new;
  }

  /**
   * Check if the model is an analog recorder.
   */
  get isAnalogRecorder(): boolean {
    return this.isRecorder && !this.isSpikeRecorder;
  }

  /**
   * Check if the model is a multimeter.
   */
  get isMultimeter(): boolean {
    return this._existing === 'multimeter';
  }

  /**
   * Check if the model is a neuron.
   */
  get isNeuron(): boolean {
    return this.elementType === 'neuron';
  }

  /**
   * Check if the model is a recorder.
   */
  get isRecorder(): boolean {
    return this.elementType === 'recorder';
  }

  /**
   * Check if the model is a spike recorder.
   */
  get isSpikeRecorder(): boolean {
    return this._existing === 'spike_recorder';
  }

  /**
   * Check if the model is a stimulator.
   */
  get isStimulator(): boolean {
    return this.elementType === 'stimulator';
  }

  /**
   * Check if the model is a synapse.
   */
  get isSynapse(): boolean {
    return this.elementType === 'synapse';
  }

  /**
   * Check if the model is a weight recorder.
   */
  get isWeightRecorder(): boolean {
    return this._existing === 'weight_recorder';
  }

  get idx(): number {
    return this._idx;
  }

  get filteredParams(): ModelParameter[] {
    return this._params.filter((param: ModelParameter) => param.visible);
  }

  get label(): string {
    return this._new;
  }

  get model(): Model {
    return this._network.project.app.model.getModel(this._existing);
  }

  get models(): Model[] {
    const models: Model[] = this._network.project.app.model.state.models;
    return [...models];
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._network;
  }

  get new(): string {
    return this._new;
  }

  set new(value: string) {
    const nodes = this.nodes;
    const connections = this._network.connections.filter(
      (connection: Connection) => connection.synapse.modelId === this._new
    );
    this._new = value;
    nodes.forEach((node: Node) => (node.modelId = this._new));
    connections.forEach(
      (connection: Connection) => (connection.synapse.modelId = this._new)
    );
  }

  get nodes(): Node[] {
    return this._network.nodes.filter(
      (node: Node) => node.modelId === this._new
    );
  }

  get params(): ModelParameter[] {
    return this._params;
  }

  set params(values: any[]) {
    this._params = values.map(value => new ModelParameter(this.model, value));
  }

  get recordables(): any[] {
    return this.model.recordables;
  }

  get state(): any {
    return this._state;
  }

  get weightRecorder(): Node {
    if (!this.hasWeightRecorderParam) {
      return new Node(this._network);
    }

    // Get weight recorder parameter.
    const weightRecorderParam = this._params.find(
      (param: Parameter) => param.id === 'weight_recorder'
    );

    // Return weight recorder node.
    return this._network.nodes.find(
      (node: Node) => node.view.label === weightRecorderParam.value
    );
  }

  /**
   * Add model parameter component.
   * @param param - parameter object
   */
  addModelParameter(param: any): void {
    const parameter = new ModelParameter(this, param);
    this._params.push(parameter);
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    const parameter = new Parameter(this, param);
    parameter.state.visible = true;
    this._params.push(parameter);
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addWeightRecorderParameter(param: any): void {
    this.addParameter({
      id: 'weight_recorder',
      input: 'select',
      label: 'weight recorder',
      items: this._network.weightRecorders.map(
        (recorder: Node) => recorder.view.label
      ),
      value: param.value,
    });
  }

  clean(): void {
    this._idx = this._network.models.indexOf(this);

    const weightRecorderParam: any = this._params.find(
      (param: Parameter) => param.id === 'weight_recorder'
    );

    // Update weight recorder list to select.
    if (weightRecorderParam) {
      weightRecorderParam.items = this._network.weightRecorders.map(
        (recorder: Node) => recorder.view.label
      );
    }
  }

  /**
   * Check if model has params.
   */
  hasParameters(model: any): boolean {
    return model.hasOwnProperty('params');
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.params.map((param: ModelParameter) => (param.state.visible = false));
  }

  /**
   * Initialize parameter components.
   * @param model - model object
   */
  initParameters(model: any = null): void {
    // Update parameters from model
    this._params = [];
    if (this.model && model && this.hasParameters(model)) {
      this.model.params.forEach((modelParam: ModelParameter) => {
        const param = model.params.find((p: any) => p.id === modelParam.id);
        this.addModelParameter(param || modelParam.toJSON());
      });
    } else if (this.model) {
      this.model.params.forEach((param: ModelParameter) =>
        this.addModelParameter(param.toJSON())
      );
    } else if (this.hasParameters(model)) {
      model.params.forEach((param: any) => this.addParameter(param));
    }

    if (this.model.isSynapse) {
      const weightRecorders = this._network.recorders
        .filter((recorder: Node) => recorder.model.id === 'weight_recorder')
        .map((recorder: Node) => recorder.view.label);
      let weightRecorder: string = weightRecorders[weightRecorders.length - 1];

      if (model && this.hasParameters(model)) {
        const weightRecorderParam = model.params.find(
          (param: Parameter) => param.id === 'weight_recorder'
        );
        if (weightRecorderParam) {
          weightRecorder = weightRecorderParam.value;
        }
      }

      if (weightRecorder) {
        this.addWeightRecorderParameter({
          value: weightRecorder,
        });
      }
    }
  }

  isAssignedToWeightRecorder(node: Node): boolean {
    const weightRecorderParam: Parameter = this._params.find(
      (param: Parameter) => param.visible && param.id === 'weight_recorder'
    );
    return weightRecorderParam
      ? weightRecorderParam.value === node.view.label
      : false;
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits network changes.
   */
  modelChanges(): void {
    this._network.networkChanges();
  }

  /**
   * Delete model.
   *
   * @remarks
   * It removes model component of the network.
   */
  remove(): void {
    this._network.nodes
      .filter((node: Node) => node.modelId === this.new)
      .forEach((node: Node) => (node.modelId = this.existing));
    this._network.connections
      .filter(
        (connection: Connection) => connection.synapse.modelId === this.new
      )
      .forEach(
        (connection: Connection) => (connection.synapse.modelId = this.existing)
      );
    this._network.deleteModel(this);
    this.clean();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.params.map((param: ModelParameter) => (param.state.visible = true));
  }

  /**
   * Serialize for JSON.
   * @return model object
   */
  toJSON(): any {
    const model: any = {
      existing: this._existing,
      new: this._new,
      params: this.filteredParams.map((param: ModelParameter) =>
        param.toJSON()
      ),
    };

    return model;
  }
}
