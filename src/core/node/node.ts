import { Activity } from '../activity/activity';
import { AnalogSignalActivity } from '../activity/analogSignalActivity';
import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { ModelParameter } from '../parameter/modelParameter';
import { Network } from '../network/network';
import { NodeCode } from './nodeCode';
import { NodeSpatial } from './nodeSpatial';
import { NodeView } from './nodeView';
import { SpikeActivity } from '../activity/spikeActivity';

export class Node extends Config {
  private readonly _name = 'Node';

  private _activity: SpikeActivity | AnalogSignalActivity | Activity;
  private _code: NodeCode; // code service for node
  private _idx: number; // generative
  private _modelId: string;
  private _network: Network; // parent
  private _params: ModelParameter[];
  private _positions: number[][] = [];
  private _recordFrom: string[]; // only for multimeter
  private _size: number;
  private _spatial: NodeSpatial;
  private _view: NodeView;

  constructor(network: any, node: any) {
    super('Node');
    this._idx = network.nodes.length;
    this._modelId = node.model;
    this._network = network;
    this._size = node.size || 1;

    this._code = new NodeCode(this);
    this._view = new NodeView(this, node.view);

    this.initParameters(node);
    this.initSpatial(node.spatial);
  }

  get activity(): SpikeActivity | AnalogSignalActivity | Activity {
    return this._activity;
  }

  set activity(value: SpikeActivity | AnalogSignalActivity | Activity) {
    this._activity = value;
  }

  get code(): NodeCode {
    return this._code;
  }

  get filteredParams(): ModelParameter[] {
    return this._params.filter((param: ModelParameter) => param.visible);
  }

  get idx(): number {
    return this._idx;
  }

  get model(): Model {
    return this._network.project.app.getModel(this._modelId);
  }

  /**
   * Set model.
   *
   * @remarks
   * Save model id, see modelId.
   *
   * @param value - node model
   */
  set model(model: Model) {
    this.modelId = model.id;
  }

  get models(): Model[] {
    const elementType: string = this.model.elementType;
    return this._network.project.app.filterModels(elementType);
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model id.
   *
   * @remarks
   * It initializes parameters, spaital activity and activity graph components.
   * It triggers node changes to start simulation.
   *
   * @param value - id of the model
   */
  set modelId(value: string) {
    this._modelId = value;
    this._size = 1;
    this.initParameters();
    this._network.clean();
    if (this.model.isRecorder()) {
      this.initActivity();
      this._network.project.activityGraph.init();
    }
    this.nodeChanges();
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
    if (this.model.existing === 'spike_recorder') {
      return this.sources;
    }
    if (['multimeter', 'voltmeter'].includes(this.model.existing)) {
      return this.targets;
    }
    return [];
  }

  get params(): ModelParameter[] {
    return this._params;
  }

  get positions(): number[][] {
    return this._positions;
  }

  // set positions(value: number[][]) {
  //   this._positions = value;
  // }

  get recordables(): string[] {
    if (this.model.existing !== 'multimeter') {
      return [];
    }
    const targets: Node[] = this.targets;
    if (targets.length === 0) {
      return [];
    }
    const recordables = targets.map((target: Node) => target.model.recordables);
    if (recordables.length === 0) {
      return [];
    }
    const recordablesFlat: string[] = [].concat(...recordables);
    const recordablesSet: any[] = [...new Set(recordablesFlat)];
    recordablesSet.sort((a: number, b: number) => a - b);
    return recordablesSet;
  }

  get recordFrom(): string[] {
    return this._recordFrom;
  }

  set recordFrom(value: string[]) {
    this._recordFrom = value;
    this.network.project.activityGraph.init();
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

  get view(): NodeView {
    return this._view;
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes
   */
  nodeChanges(): void {
    this._spatial.updateHash();
    this._network.networkChanges();
  }

  /**
   * Initialize activity for the recorder.
   */
  initActivity(activity: any = {}): void {
    if (this.model.existing === 'spike_recorder') {
      this._activity = new SpikeActivity(this);
    } else if (['voltmeter', 'multimeter'].includes(this.model.existing)) {
      this._activity = new AnalogSignalActivity(this, activity);
    } else if (this.model.isRecorder()) {
      this._activity = new Activity(this, activity);
    }
  }

  /**
   * Initialize parameter components.
   * @param node - node object
   */
  initParameters(node: any = null): void {
    // Update parameters from model or node
    this._params = [];
    if (this.model && node && node.hasOwnProperty('params')) {
      this.model.params.forEach((modelParam: ModelParameter) => {
        const nodeParam = node.params.find((p: any) => p.id === modelParam.id);
        this.addParameter(nodeParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach((param: ModelParameter) =>
        this.addParameter(param)
      );
    } else if (node.hasOwnProperty('params')) {
      node.params.forEach((param: ModelParameter) => this.addParameter(param));
    }
    if (this.model.existing === 'multimeter') {
      this._recordFrom = node !== null ? node.recordFrom || ['V_m'] : ['V_m'];
    }
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: any): void {
    this._params.push(new ModelParameter(this, param));
  }

  /**
   * Check if node has parameter component.
   * @param paramId - parameter id
   */
  hasParameter(paramId: string): boolean {
    return (
      this._params.find((param: ModelParameter) => param.id === paramId) !==
      undefined
    );
  }

  /**
   * Get parameter component
   * @param paramId - parameter id
   * @return parameter component
   */
  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this._params.find((param: ModelParameter) => param.id === paramId)
        .value;
    }
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    this._params.forEach((param: ModelParameter) => param.reset());
    this.nodeChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.params.map((param: ModelParameter) => (param.visible = false));
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.params.map((param: ModelParameter) => (param.visible = true));
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
        connection.target.model.elementType !== 'recorder'
    );
    connections.forEach((connection: Connection) => {
      const weight: any = connection.synapse.params.find(
        (param: ModelParameter) => param.id === 'weight'
      );
      weight.value = (term === 'inhibitory' ? -1 : 1) * Math.abs(weight.value);
      weight.visible = true;
    });
    this.nodeChanges();
  }

  /**
   * Initialize spatial component.
   * @param spatial - spatial specifications
   */
  initSpatial(spatial: any = {}): void {
    this._spatial = new NodeSpatial(this, spatial);
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(): void {
    const term: string = this._size === 1 ? 'grid' : 'free';
    this.initSpatial({
      positions: this.spatial.hasPositions() ? undefined : term,
    });
    this.nodeChanges();
  }

  /**
   * Clean node component.
   */
  clean(): void {
    this._idx = this._network.nodes.indexOf(this);
    this.collectRecordFromTargets();
    this.view.clean();
  }

  /**
   * Collect record data from target nodes.
   */
  collectRecordFromTargets(): void {
    if (this.model.existing !== 'multimeter') {
      return;
    }
    const recordables = this.recordables;
    this._recordFrom =
      recordables.length > 0
        ? this.recordFrom.filter((rec: string) => recordables.includes(rec))
        : [];
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
  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): any {
    const node: any = {
      model: this._modelId,
      params: this._params.map((param: ModelParameter) => param.toJSON()),
      size: this._size,
      view: this._view.toJSON(),
    };

    // Add recordFrom if this model is multimeter.
    if (this.model.existing === 'multimeter') {
      node.recordFrom = this._recordFrom;
    }

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions()) {
      node.spatial = this._spatial.toJSON();
    }

    return node;
  }
}
