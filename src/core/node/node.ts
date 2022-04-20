import { sha1 } from 'object-hash';

import { Activity } from '../activity/activity';
import { AnalogSignalActivity } from '../activity/analogSignalActivity';
import { Config } from '../common/config';
import { Connection } from '../connection/connection';
import { consoleLog } from '../common/logger';
import { CopyModel } from '../model/copyModel';
import { Model } from '../model/model';
import { ModelParameter } from '../model/modelParameter';
import { Network } from '../network/network';
import { NodeCompartment } from './nodeCompartment/nodeCompartment';
import { NodeParameter } from './nodeParameter';
import { NodeReceptor } from './nodeReceptor/nodeReceptor';
import { NodeRecord } from './nodeRecord';
import { NodeSpatial } from './nodeSpatial/nodeSpatial';
import { NodeState } from './nodeState';
import { NodeView } from './nodeView';
import { Parameter } from '../parameter/parameter';
import { SpikeActivity } from '../activity/spikeActivity';
import { SynapseParameter } from '../synapse/synapseParameter';

export class Node extends Config {
  private readonly _name = 'Node';

  private _activity: SpikeActivity | AnalogSignalActivity | Activity;
  private _compartments: NodeCompartment[] = [];
  private _doc: any = {};
  private _idx: number; // generative
  private _hash: string;
  private _modelId: string;
  private _network: Network; // parent
  private _params: NodeParameter[] = [];
  private _positions: number[][] = [];
  private _receptors: NodeReceptor[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = []; // only for multimeter
  private _size: number;
  private _spatial: NodeSpatial;
  private _state: NodeState;
  private _view: NodeView;

  constructor(network: any, node: any = {}) {
    super('Node');
    this._idx = network.nodes.length;
    this._modelId = node.model;
    this._network = network;
    this._size = node.size || 1;
    this._doc = node;

    this._view = new NodeView(this, node.view);
    this._state = new NodeState(this);
    this._spatial = new NodeSpatial(this, node.spatial);

    this.initParameters(node);

    if (node.hasOwnProperty('compartments')) {
      this._compartments = node.compartments.forEach(
        (compartment: any) => new NodeCompartment(this, compartment)
      );
    }

    if (node.hasOwnProperty('receptors')) {
      this._receptors = node.receptors.forEach(
        (receptor: any) => new NodeReceptor(this, receptor)
      );
    }

    this.initActivity(node.activity);

    this.updateHash();
  }

  get activity(): SpikeActivity | AnalogSignalActivity | Activity {
    return this._activity;
  }

  set activity(value: SpikeActivity | AnalogSignalActivity | Activity) {
    this._activity = value;
  }

  get assignedModels(): CopyModel[] {
    if (this._modelId !== 'weight_recorder') {
      return [];
    }

    return this._network.models.filter((model: CopyModel) =>
      model.params.some((param: Parameter) => param.value === this.view.label)
    );
  }

  get compartments(): NodeCompartment[] {
    return this._compartments;
  }

  get filteredParams(): NodeParameter[] {
    return this._params.filter((param: NodeParameter) => param.state.visible);
  }

  get hash(): string {
    return this._hash;
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model.isNeuron && this._view.weight === 'excitatory';
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this.model.isNeuron && this._view.weight === 'inhibitory';
  }

  get idx(): number {
    return this._idx;
  }

  get model(): CopyModel | Model {
    if (
      this._network.nodeModels.some(
        (model: CopyModel) => model.id === this.modelId
      )
    ) {
      return this._network.getModel(this._modelId);
    } else {
      return this._network.project.app.model.getModel(this._modelId);
    }
  }

  /**
   * Set model.
   *
   * @remarks
   * Save model id, see modelId.
   *
   * @param model - node model
   */
  set model(model: CopyModel | Model) {
    this.modelId = model.id;
  }

  get models(): (CopyModel | Model)[] {
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this._network.project.app.model.filterModels(elementType);
    const modelsCopied: CopyModel[] = this._network.filterModels(elementType);
    const filteredModels = [...models, ...modelsCopied];
    filteredModels.sort();
    return filteredModels;
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model id.
   *
   * @remarks
   * It initializes parameters and activity components.
   * It triggers node changes.
   *
   * @param value - id of the model
   */
  set modelId(value: string) {
    this._modelId = value;

    this.initParameters();
    this.initActivity();

    this.updateRecords();
    this.updateRecordsColor();

    // Trigger node change.
    this.nodeChanges();

    // Initialize activity graph.
    if (this.model.isRecorder) {
      this._network.project.initActivityGraph();
    }
  }

  get n(): number {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._network;
  }

  get nodes(): Node[] {
    if (this.model.isSpikeRecorder) {
      return this.sources;
    }
    if (this.model.isAnalogRecorder) {
      return this.targets;
    }
    return [];
  }

  get params(): NodeParameter[] {
    return this._params;
  }

  set params(values: any[]) {
    this._params = values.map(value => new NodeParameter(this, value));
  }

  get positions(): number[][] {
    return this._positions;
  }

  get receptors(): NodeReceptor[] {
    return this._receptors;
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
  }

  get records(): NodeRecord[] {
    return this._records;
  }

  set records(value: NodeRecord[]) {
    this._records = value;
  }

  get recordsFixed(): string {
    return (
      '[' +
      this._records.map((record: any) => '"' + record.id + '"').join(',') +
      ']'
    );
  }

  get hasSomeVisibleParams(): boolean {
    return (
      this._params.some((param: NodeParameter) => param.visible) ||
      this._modelId === 'multimeter' ||
      this._network.project.simulation.code.runSimulationInsite
    );
  }

  get size(): number {
    return this._size;
  }

  /**
   * Set network size.
   */
  set size(value: number) {
    this._size = value;
    this.nodeChanges();
  }

  /**
   * Returns the first six digits of the SHA-1 node hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  get sources(): Node[] {
    const nodes: Node[] = this._network.connections
      .filter((connection: Connection) => connection.targetIdx === this._idx)
      .map((connection: Connection) => connection.source);
    return nodes;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
  }

  get targets(): Node[] {
    const nodes: Node[] = this._network.connections
      .filter((connection: Connection) => connection.sourceIdx === this._idx)
      .map((connection: Connection) => connection.target);
    return nodes;
  }

  get state(): NodeState {
    return this._state;
  }

  get view(): NodeView {
    return this._view;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 6);
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes.
   */
  nodeChanges(): void {
    this.clean();
    this._spatial.updateHash();
    this._network.networkChanges();
  }

  /**
   * Initialize activity for the recorder.
   */
  initActivity(data: any = {}): void {
    if (!this.model.isRecorder) {
      return;
    }
    if (this.model.isSpikeRecorder) {
      this._activity = new SpikeActivity(this, data);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new AnalogSignalActivity(this, data);
    } else {
      this._activity = new Activity(this, data);
    }
  }

  /**
   * Initialize parameter components.
   * @param node - node object
   */
  initParameters(node: any = null): void {
    // Update parameters from model or node
    this._params = [];
    if (this.model) {
      this.model.params.forEach((modelParam: ModelParameter) => {
        if (node && this.hasParameters(node)) {
          const nodeParam = node.params.find(
            (p: any) => p.id === modelParam.id
          );
          this.addParameter(nodeParam || modelParam.toJSON());
        } else {
          this.addParameter(modelParam.toJSON());
        }
      });
    } else if (this.hasParameters(node)) {
      node.params.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Check if node has params.
   */
  hasParameters(node: any): boolean {
    return node.hasOwnProperty('params');
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params.push(new NodeParameter(this, param));
  }

  /**
   * Check if node has parameter component.
   * @param paramId - parameter id
   */
  hasParameter(paramId: string): boolean {
    return this._params.some((param: NodeParameter) => param.id === paramId);
  }

  /**
   * Get parameter component.
   * @param paramId - parameter id
   * @return parameter component
   */
  getParameter(paramId: string): NodeParameter {
    return this._params.find((param: NodeParameter) => param.id === paramId);
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    this._params.forEach((param: NodeParameter) => param.reset());
    this.nodeChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.params.map((param: NodeParameter) => (param.state.visible = false));
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.params.map((param: NodeParameter) => (param.state.visible = true));
  }

  /**
   * Set all synaptic weights.
   *
   * @remarks
   * It emits node changes.
   *
   * @param term - inhibitory (negative) or excitatory (positive)
   */
  setWeights(term: string): void {
    const connections: Connection[] = this._network.connections.filter(
      (connection: Connection) =>
        connection.source.idx === this._idx &&
        !connection.target.model.isRecorder
    );
    connections.forEach((connection: Connection) => {
      const weight: any = connection.synapse.params.find(
        (param: SynapseParameter) => param.id === 'weight'
      );
      weight.value = (term === 'inhibitory' ? -1 : 1) * Math.abs(weight.value);
      weight.visible = true;
    });
    this.nodeChanges();
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(): void {
    const term: string = this._size === 1 ? 'grid' : 'free';
    this._spatial.init({
      positions: this.spatial.hasPositions ? undefined : term,
    });
    this.nodeChanges();
  }

  /**
   * Update hash for node graph.
   */
  updateHash(): void {
    this._hash = sha1({
      color: this.view.color,
      idx: this.idx,
      darkMode: this._network.project.app.darkMode,
    });
  }

  /**
   * Remove record from the state.
   */
  removeRecord(record: any): void {
    this._records.splice(this._records.indexOf(record), 1);
    this._records = [...this._records];
  }

  /**
   * Update records.
   *
   * @remarks
   * It should be called after connections are created.
   */
  updateRecords(): void {
    let recordables: any[] = [];
    // Initialize recordables.
    if (this.targets.length > 0) {
      if (this._modelId === 'multimeter') {
        const recordablesNodes = this.targets.map((target: Node) => [
          ...target.model.recordables,
        ]);
        if (recordablesNodes.length > 0) {
          const recordablesPooled: any[] = recordablesNodes.flat();
          recordables = [...new Set(recordablesPooled)];
          recordables.sort((a: any, b: any) => a.id - b.id);
        }
      } else if (this._modelId === 'voltmeter') {
        recordables.push(
          this.model.config.recordables.find(
            (record: any) => record.id === 'V_m'
          )
        );
      }
    } else if (this._modelId === 'weight_recorder') {
      recordables.push(
        this.model.config.recordables.find(
          (record: any) => record.id === 'weights'
        )
      );
    }

    let recordableIds: string[];
    recordableIds = recordables.map((record: any) => record.id);
    this._recordables = [
      ...this._recordables.filter((record: NodeRecord) =>
        recordableIds.includes(record.id)
      ),
    ];

    recordableIds = this._recordables.map((record: any) => record.id);
    recordables
      .filter((record: any) => !recordableIds.includes(record.id))
      .forEach((record: any) => {
        this._recordables.push(new NodeRecord(this, record));
      });

    // Initialize selected records.
    if (this._doc.records != null) {
      // Load record from stored nodes.
      const recordIds = this._doc.records.map((record: any) => record.id);
      this._records = [
        ...this._recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
    } else if (this._records.length > 0) {
      // In case when user select other model.
      const recordIds = this._records.map((record: NodeRecord) => record.id);
      this._records = [
        ...this._recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
      this.records.forEach((record: NodeRecord) => record.updateGroupID());
    } else {
      this._records = [...this._recordables];
    }
  }

  /**
   * Update record colors.
   */
  updateRecordsColor(): void {
    const color = this._view.color;
    this._recordables.forEach((record: NodeRecord) => {
      record.color = color;
    });
  }

  /**
   * Clean node component.
   */
  clean(): void {
    this._idx = this._network.nodes.indexOf(this);
    this.view.clean();
    this.updateHash();

    this.updateRecords();
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  clone(): Node {
    return new Node(this._network, this.copy(this.toJSON()));
  }

  /**
   * Delete node.
   *
   * @remarks
   * It removes node component of the network.
   */
  remove(): void {
    this._network.deleteNode(this);
  }

  /**
   * Copy node object of this component.
   *
   * @remarks
   * It uses JSON converting method.
   *
   * @return copied node object
   */
  override copy(item: any): any {
    return Object.assign({}, item);
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): any {
    const node: any = {
      model: this._modelId,
      params: this._params.map((param: NodeParameter) => param.toJSON()),
      size: this._size,
      view: this._view.toJSON(),
    };

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) {
      node.records = this._records.map((nodeRecord: NodeRecord) =>
        nodeRecord.toJSON()
      );
    }

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions) {
      node.spatial = this._spatial.toJSON();
    }

    if (this._compartments.length > 0) {
      node.compartments = this._compartments.map(
        (compartment: NodeCompartment) => compartment.toJSON()
      );
    }

    if (this._receptors.length > 0) {
      node.receptors = this._receptors.map((receptor: NodeReceptor) =>
        receptor.toJSON()
      );
    }

    return node;
  }
}
