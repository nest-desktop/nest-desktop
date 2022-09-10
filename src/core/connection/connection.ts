import { sha1 } from 'object-hash';

import { Config } from '../common/config';
import { ConnectionMask } from './connectionMask';
import { ConnectionState } from './connectionState';
import { ConnectionView } from './connectionView';
import { CopyModel } from '../model/copyModel';
import { Model } from '../model/model';
import { SynapseParameter } from '../synapse/synapseParameter';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { NodeSlice } from '../node/nodeSlice';
import { ConnectionParameter } from './connectionParameter';
import { Synapse } from '../synapse/synapse';

enum Rule {
  AllToAll = 'all_to_all',
  FixedIndegree = 'fixed_indegree',
  FixedOutdegree = 'fixed_outdegree',
  FixedTotalNumber = 'fixed_total_number',
  OneToOne = 'one_to_one',
  PairwiseBernoulli = 'pairwise_bernoulli',
  symmetricPairwiseBernoulli = 'symmetric_pairwise_bernoulli',
}

export class Connection extends Config {
  private readonly _name = 'Connection';

  private _hash: string;
  private _idx: number; // generative
  private _mask: ConnectionMask;
  private _network: Network; // parent
  private _params: ConnectionParameter[];
  private _rule: string;
  private _sourceIdx: number; // Node index
  private _sourceSlice: NodeSlice;
  private _state: ConnectionState;
  private _synapse: Synapse;
  private _targetIdx: number; // Node index
  private _targetSlice: NodeSlice;
  private _view: ConnectionView;

  constructor(network: any, connection: any) {
    super('Connection');
    this._network = network;
    this._idx = network.connections.length;

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connection.source;
    this._sourceSlice = new NodeSlice(this.source, connection.sourceSlice);

    this._targetIdx = connection.target;
    this._targetSlice = new NodeSlice(this.target, connection.targetSlice);

    this._rule = connection.rule || Rule.AllToAll;
    this.initParameters(connection.params);
    this._mask = new ConnectionMask(this, connection.mask);
    this._synapse = new Synapse(this, connection.synapse);

    this.updateHash();
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): ConnectionParameter[] {
    return this._params.filter(
      (param: ConnectionParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get hasConnSpec(): boolean {
    return !this.isRuleAllToAll;
  }

  get hasSomeVisibleParams(): boolean {
    return this._params.some(
      (param: ConnectionParameter) => param.state.visible
    );
  }

  get idx(): number {
    return this._idx;
  }

  get isRuleAllToAll(): boolean {
    return this._rule === 'all_to_all';
  }

  get mask(): ConnectionMask {
    return this._mask;
  }

  get model(): CopyModel | Model {
    return this._synapse.model;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._network;
  }

  get params(): any[] {
    return this._params;
  }

  get recorder(): Node {
    return this.source.model.isRecorder ? this.source : this.target;
  }

  get rule(): string {
    return this._rule;
  }

  set rule(value: string) {
    this._rule = value;
    this.initParameters();
  }

  /**
   * Returns the first six digits of the SHA-1 connection hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  get source(): Node {
    return this._network.nodes[this._sourceIdx];
  }

  set source(node: Node) {
    this._sourceIdx = node.idx;
  }

  get sourceIdx(): number {
    return this._sourceIdx;
  }

  set sourceIdx(value: number) {
    this._sourceIdx = value;
  }

  get sourceSlice(): NodeSlice {
    return this._sourceSlice;
  }

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): Synapse {
    return this._synapse;
  }

  get target(): Node {
    return this._network.nodes[this._targetIdx];
  }

  set target(node: Node) {
    this._targetIdx = node.idx;
  }

  get targetIdx(): number {
    return this._targetIdx;
  }

  set targetIdx(value: number) {
    this._targetIdx = value;
  }

  get targetSlice(): NodeSlice {
    return this._targetSlice;
  }

  get view(): ConnectionView {
    return this._view;
  }

  /**
   * Sets all params to visible.
   */
  public showAllParams(): void {
    this.params.forEach(
      (param: ConnectionParameter) => (param.state.visible = true)
    );
  }

  /**
   * Sets all params to invisible.
   */
  public hideAllParams(): void {
    this.params.forEach(
      (param: ConnectionParameter) => (param.state.visible = false)
    );
  }

  /**
   * Resets all parameters to their default.
   */
  public resetAllParams(): void {
    const ruleConfig: any = this.getRuleConfig();
    this.params.forEach((param: ConnectionParameter) => {
      param.reset();
      const p: any = ruleConfig.params.find((p: any) => p.id === param.id);
      param.value = p.value;
    });
    this.synapse.params.forEach((param: SynapseParameter) => param.reset());
  }

  /**
   * Observer for connection changes.
   *
   * @remarks
   * It emits network changes.
   */
  connectionChanges(): void {
    this._network.networkChanges();
  }

  /**
   * Initialize parameters.
   */
  initParameters(params: any[] = undefined): void {
    this._params = [];
    const ruleConfig: any = this.getRuleConfig();
    ruleConfig.params.forEach((param: any) => {
      if (params != null) {
        const p: any = params.find((p: any) => p.id === param.id);
        if (p != null) {
          param.value = p.value;
          param.visible = p.visible;
        }
      }
      this.addParameter(param);
    });
  }

  /**
   * Add connection parameter.
   */
  addParameter(param: any): void {
    this._params.push(new ConnectionParameter(this, param));
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): any {
    return this.config.rules.find((r: any) => r.value === this._rule);
  }

  /**
   * Reverse source and target indices.
   *
   * @remarks
   * It emits connection changes.
   */
  reverse(): void {
    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];

    // Trigger connection change.
    this.connectionChanges();

    // Initialize activity graph.
    if (this._view.connectRecorder()) {
      this.recorder.initActivity();
      this._network.project.initActivityGraph();
    }
  }

  /**
   * Update hash for connection graph.
   */
  updateHash(): void {
    this._hash = sha1({
      color: this.source.view.color,
      idx: this.idx,
    });
  }

  /**
   * Clean this component.
   */
  clean(): void {
    this._idx = this._network.connections.indexOf(this);
    this.updateHash();
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return this.source.spatial.hasPositions && this.target.spatial.hasPositions;
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  reset(): void {
    this.rule = Rule.AllToAll;
    this.initParameters();
    this.synapse.modelId = 'static_synapse';
    this._mask.unmask();
    this.connectionChanges();
  }

  /**
   * Delete connection from the network.
   */
  remove(): void {
    this._network.deleteConnection(this);
  }

  /**
   * Serialize for JSON.
   * @return connection object
   */
  toJSON(): any {
    const connection: any = {
      params: this._params.map((param: ConnectionParameter) => param.toJSON()),
      rule: this._rule,
      source: this._sourceIdx,
      synapse: this._synapse.toJSON(),
      target: this._targetIdx,
    };

    if (this._sourceSlice.visible) {
      connection.sourceSlice = this._sourceSlice.toJSON();
    }

    if (this._targetSlice.visible) {
      connection.targetSlice = this._targetSlice.toJSON();
    }

    if (this._mask.hasMask) {
      connection.mask = this._mask.toJSON();
    }

    return connection;
  }
}
