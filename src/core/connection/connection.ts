import { Config } from '../config';
import { ConnectionCode } from './connectionCode';
import { ConnectionMask } from './connectionMask';
import { ConnectionProjections } from './connectionProjections';
import { ConnectionView } from './connectionView';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { Parameter } from '../parameter';
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
  private _params: any[];
  private _projections: ConnectionProjections; // only for NEST 2, will be deprecated in NEST 3;
  private _rule: string;
  private _sourceIdx: number; // Node index
  private _synapse: Synapse;
  private _targetIdx: number; // Node index
  private _view: ConnectionView;

  srcIdx?: number[];
  tgtIdx?: number[];

  constructor(network: any, connection: any) {
    super('Connection');
    this._network = network;
    this._idx = network.connections.length;
    this._code = new ConnectionCode(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connection.source;
    this._targetIdx = connection.target;

    this._rule = connection.rule || Rule.AllToAll;
    this._params = connection.params || [];

    this._mask = new ConnectionMask(this, connection.mask);
    this._projections = new ConnectionProjections(this, connection.projections);
    this._synapse = new Synapse(this, connection.synapse);
  }

  get code(): ConnectionCode {
    return this._code;
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

  get projections(): ConnectionProjections {
    return this._projections;
  }

  get rule(): string {
    return this._rule;
  }

  set rule(value: string) {
    this._rule = value;
    this._params = this.view.getRuleParams();
    this.connectionChanges();
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

  get view(): ConnectionView {
    return this._view;
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
   * Reverse source and target indices.
   *
   * @remarks
   * It emits connection changes.
   */
  reverse(): void {
    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];
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
   * Check if it has projection.
   */
  hasProjections(): boolean {
    return false;
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  reset(): void {
    this.srcIdx = undefined;
    this.tgtIdx = undefined;
    this.rule = Rule.AllToAll;
    this.synapse.modelId = 'static_synapse';
    this._projections.reset();
    this._mask.unmask();
    this.connectionChanges();
  }

  /**
   * Check if it has selective source indices.
   */
  hasSourceIndices(): boolean {
    return this.srcIdx !== undefined;
  }

  /**
   * Check if it has selective target indices.
   */
  hasTargetIndices(): boolean {
    return this.tgtIdx !== undefined;
  }

  /**
   * Delete connection from the network.
   */
  delete(): void {
    this._network.deleteConnection(this);
  }

  /**
   * Serialize for JSON.
   * @return connection object
   */
  toJSON(target: string = 'db'): any {
    const connection: any = {
      source: this._sourceIdx,
      target: this._targetIdx,
    };

    if (this.isBothSpatial()) {
      connection.projections = this._projections.toJSON(target);
      if (this._mask.hasMask()) {
        connection.projections.mask = this._mask.toJSON(target);
      }
    } else {
      if (target === 'simulator') {
        // Collect specifications of the connection
        connection.conn_spec = {
          rule: this._rule,
        };
        this._params.forEach(
          (param: Parameter) => (connection.conn_spec[param.id] = param.value)
        );
        connection.syn_spec = this._synapse.toJSON(target); // Collect specifications of the synapse
      } else {
        connection.rule = this._rule;
        connection.params = this._params;
        connection.synapse = this._synapse.toJSON(target);
      }
    }

    return connection;
  }
}
