// connection.ts

import { sha1 } from "object-hash";
import { Config } from "@/helpers/config";

import { ConnectionMask } from "./connectionMask";
import {
  ConnectionParameter,
  ConnectionParameterProps,
} from "./connectionParameter";
import { ConnectionRule } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { Connections } from "./connections";
import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import { Network } from "../network/network";
import { Node } from "../node/node";
import { NodeSlice } from "../node/nodeSlice";
import { Synapse } from "../synapse/synapse";
import { SynapseParameter } from "../synapse/synapseParameter";

export interface ConnectionProps {
  source: number;
  target: number;
  sourceSlice?: any;
  targetSlice?: any;
  rule?: any;
  params?: ConnectionParameterProps[];
  mask?: any;
  synapse?: any;
}

export class Connection extends Config {
  private readonly _name = "Connection";

  private _hash: string = "";
  private _idx: number; // generative
  private _mask: ConnectionMask;
  private _connections: Connections; // parent
  private _params: { [key: string]: ConnectionParameter } = {};
  private _rule: ConnectionRule;
  private _sourceIdx: number; // Node index
  private _sourceSlice: NodeSlice;
  private _state: ConnectionState;
  private _synapse: Synapse;
  private _targetIdx: number; // Node index
  private _targetSlice: NodeSlice;
  private _view: ConnectionView;

  constructor(connections: Connections, connection: ConnectionProps) {
    super("Connection");
    this._connections = connections;
    this._idx = this._connections.all.length;

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connection.source;
    this._sourceSlice = new NodeSlice(this.source, connection.sourceSlice);

    this._targetIdx = connection.target;
    this._targetSlice = new NodeSlice(this.target, connection.targetSlice);

    this._rule = new ConnectionRule(this, connection.rule);
    this.initParameters(connection.params);
    this._mask = new ConnectionMask(this, connection.mask);
    this._synapse = new Synapse(this, connection.synapse);

    this.updateHash();
  }

  get connections(): Connections {
    return this._connections;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): ConnectionParameter[] {
    return Object.values(this._params).filter(
      (param: ConnectionParameter) => param.state.visible
    );
  }

  get hash(): string {
    return this._hash;
  }

  get hasConnSpec(): boolean {
    return this._rule.value != "all_to_all";
  }

  get hasSomeVisibleParams(): boolean {
    return Object.values(this._params).some(
      (param: ConnectionParameter) => param.state.visible
    );
  }

  get idx(): number {
    return this._idx;
  }

  /**
   * Check if source and target nodes has positions.
   */
  get isBothSpatial(): boolean {
    return this.source.spatial.hasPositions && this.target.spatial.hasPositions;
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
    return this._connections.network;
  }

  get params(): { [key: string]: ConnectionParameterProps } {
    return this._params;
  }

  get recorder(): Node {
    return this.source.model.isRecorder ? this.source : this.target;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  /**
   * Returns the first six digits of the SHA-1 connection hash.
   * @returns 6-digit hash value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : "";
  }

  get source(): Node {
    return this.network.nodes.all[this._sourceIdx];
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
    return this.network.nodes.all[this._targetIdx];
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
   * Add connection parameter.
   */
  addParameter(param: ConnectionParameterProps): void {
    this._params[param.id] = new ConnectionParameter(this, param);
  }

  /**
   * Clean this component.
   */
  clean(): void {
    this._idx = this._connections.all.indexOf(this);
    this.updateHash();
  }

  /**
   * Observer for connection changes.
   *
   * @remarks
   * It emits network changes.
   */
  connectionChanges(): void {
    this.network.networkChanges();
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    Object.values(this._params).forEach(
      (param: ConnectionParameter) => (param.state.visible = false)
    );
  }

  /**
   * Initialize parameters.
   */
  initParameters(params: ConnectionParameterProps[] = []): void {
    this._params = {};
    const ruleConfig: any = this.getRuleConfig();
    ruleConfig.params.forEach((param: ConnectionParameterProps) => {
      if (params != null) {
        const p: ConnectionParameterProps | undefined = params.find(
          (p: ConnectionParameterProps) => p.id === param.id
        );
        if (p != null) {
          param.value = p.value;
          param.visible = p.visible;
          if (p.type != null) {
            param.type = p.type;
          }
        }
      }
      this.addParameter(param);
    });
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): any {
    return this.config.rules.find((r: any) => r.value === this._rule.value);
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
      this.network.project.initActivityGraph();
    }
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  reset(): void {
    this._rule.reset();
    this.initParameters();
    this.synapse.modelId = "static_synapse";
    this._mask.unmask();
    this.connectionChanges();
  }

  /**
   * Resets all parameters to their default.
   */
  resetAllParams(): void {
    const ruleConfig: any = this.getRuleConfig();

    // Reset connection parameter.
    Object.values(this._params).forEach((param: ConnectionParameter) => {
      param.reset();
      const p: any = ruleConfig.params.find((p: any) => p.id === param.id);
      param.value = p.value;
    });

    // Reset synapse parameter.
    Object.values(this.synapse.params).forEach((param: SynapseParameter) =>
      param.reset()
    );
  }

  /**
   * Delete connection from the network.
   */
  remove(): void {
    this.network.deleteConnection(this);
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    Object.values(this._params).forEach(
      (param: ConnectionParameter) => (param.state.visible = true)
    );
  }

  /**
   * Serialize for JSON.
   * @return connection object
   */
  toJSON(): ConnectionProps {
    const connection: ConnectionProps = {
      params: Object.values(this._params).map((param: ConnectionParameter) =>
        param.toJSON()
      ),
      rule: this._rule.value,
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

  /**
   * Update hash for connection graph.
   */
  updateHash(): void {
    this._hash = sha1({
      // color: this.source.view.color,
      idx: this.idx,
    });
  }
}
