import { Config } from '../config';
import { ConnectionCode } from './connectionCode';
import { ConnectionMask } from './connectionMask';
import { ConnectionView } from './connectionView';
import { Model } from '../model/model';
import { ModelParameter } from '../parameter/modelParameter';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { Parameter } from '../parameter/parameter';
import { Synapse } from './synapse';

enum Rule {
  AllToAll = 'all_to_all',
  FixedIndegree = 'fixed_indegree',
  FixedOutdegree = 'fixed_outdegree',
  FixedTotalNumber = 'fixed_total_number',
  OneToOne = 'one_to_one',
  PairwiseBernoulli = 'pairwise_bernoulli',
}

export class Connection extends Config {
  private readonly _name = 'Connection';

  private _code: ConnectionCode;
  private _idx: number; // generative
  private _mask: ConnectionMask;
  private _network: Network; // parent
  private _params: Parameter[];
  private _rule: string;
  private _sourceIdx: number; // Node index
  private _synapse: Synapse;
  private _targetIdx: number; // Node index
  private _view: ConnectionView;

  constructor(network: any, connection: any) {
    super('Connection');
    this._network = network;
    this._idx = network.connections.length;
    this._code = new ConnectionCode(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connection.source;
    this._targetIdx = connection.target;

    this._rule = connection.rule || Rule.AllToAll;
    this.initParameters(connection.params);
    this._mask = new ConnectionMask(this, connection.mask);
    this._synapse = new Synapse(this, connection.synapse);
  }

  get code(): ConnectionCode {
    return this._code;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): Parameter[] {
    return this._params.filter((param: Parameter) => param.visible);
  }

  get idx(): number {
    return this._idx;
  }

  get mask(): ConnectionMask {
    return this._mask;
  }

  get model(): Model {
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
    return this.source.model.isRecorder() ? this.source : this.target;
  }

  get rule(): string {
    return this._rule;
  }

  set rule(value: string) {
    this._rule = value;
    this.initParameters();
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

  get view(): ConnectionView {
    return this._view;
  }

  /**
   * Sets all params to visible.
   */
  public showAllParams(): void {
    this.params.forEach((param: Parameter) => (param.visible = true));
  }

  /**
   * Sets all params to invisible.
   */
  public hideAllParams(): void {
    this.params.forEach((param: Parameter) => (param.visible = false));
  }

  /**
   * Resets all parameters to their default.
   */
  public resetAllParams(): void {
    const ruleConfig: any = this.getRuleConfig();
    this.params.forEach((param: Parameter) => {
      param.reset();
      const p: any = ruleConfig.params.find((p: any) => p.id === param.id);
      param.value = p.value;
    });
    this.synapse.params.forEach((param: ModelParameter) => param.reset());
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
      if (params !== undefined) {
        const p: any = params.find((p: any) => p.id === param.id);
        if (p !== undefined) {
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
    this._params.push(new Parameter(this, param));
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
    // console.log('Reverse connection');
    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];
    this.recorder.initActivity();
    this.connectionChanges();
  }

  /**
   * Select this connection.
   */
  select(): void {
    this._network.view.selectedConnection = this;
  }

  /**
   * Clean this component.
   */
  clean(): void {
    this._idx = this._network.connections.indexOf(this);
  }

  /**
   * Check if source and target nodes has positions.
   */
  isBothSpatial(): boolean {
    return (
      this.source.spatial.hasPositions() && this.target.spatial.hasPositions()
    );
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
      source: this._sourceIdx,
      target: this._targetIdx,
      rule: this._rule,
      params: this._params.map((param: Parameter) => param.toJSON()),
      synapse: this._synapse.toJSON(),
    };

    if (this._mask.hasMask()) {
      connection.mask = this._mask.toJSON();
    }

    return connection;
  }
}
