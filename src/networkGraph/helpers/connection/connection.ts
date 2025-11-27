// connection.ts

import type { IBaseState, IConfigState, IParamState } from "@/helpers/common";
import type { Class, TConnections, TNetwork, TNode, TNodeGroup, TSynapse } from "@/types";
import { CodeNodeMask } from "@/codeGraph/helpers/codeNodeMask";

import { BaseSynapse, type ISynapseState } from "../synapse/synapse";
import { ConnectionRule } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { ConnectionParameters } from "./connectionParameters";

export interface IConnectionState extends IBaseState {
  params?: Record<string, IParamState>;
  rule?: string;
  sourceNodeId: string;
  synapse?: ISynapseState;
  targetNodeId: string;
}

export class BaseConnection<T extends IConnectionState = IConnectionState> extends CodeNodeMask<T> {
  private _params: ConnectionParameters;
  private _rule: ConnectionRule;
  private _source: TNode | TNodeGroup | undefined;
  private _state: ConnectionState;
  private _target: TNode | TNodeGroup | undefined;
  private _view: ConnectionView;

  public _connections: TConnections; // parent
  public _synapse: BaseSynapse;

  constructor(connections: TConnections, configState?: IConfigState) {
    super({
      config: { name: "Connection", ...configState },
    });

    this._connections = connections;

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._rule = new ConnectionRule(this);
    this._params = new ConnectionParameters(this);
    this._synapse = new this.Synapse(this);
  }

  get Synapse(): Class<BaseSynapse> {
    return BaseSynapse;
  }

  get connections(): TConnections {
    return this._connections;
  }

  get hasConnSpec(): boolean {
    return this._rule.value !== "all_to_all";
  }

  override get hashObject(): IBaseState {
    const hashState: {
      idx: number;
      params: Record<string, IParamState>;
      synapse: string;
      sourceModelId?: string;
      targetModelId?: string;
    } = {
      idx: this.idx,
      params: this.params.save(),
      synapse: this.synapse.hash,
    };

    if (this.source?.isNode) hashState.sourceModelId = this.sourceNode.modelId;
    if (this.target?.isNode) hashState.targetModelId = this.targetNode.modelId;

    return hashState;
  }

  get idx(): number {
    return this.connections.all.indexOf(this);
  }

  // get name(): string {
  //   return this._name;
  // }

  get nodeGroups(): TNodeGroup[] {
    return this.network.nodes.nodeGroups.filter((nodeGroup: TNodeGroup) => {
      const nodes = nodeGroup.nodeItemsDeep;
      return (
        [this.sourceNodeGroup, this.targetNodeGroup].includes(nodeGroup) ||
        nodes.includes(this.sourceNode) ||
        nodes.includes(this.targetNode)
      );
    });
  }

  get network(): TNetwork {
    return this.connections.network;
  }

  get params(): ConnectionParameters {
    return this._params;
  }

  get parent(): TConnections {
    return this.connections;
  }

  get recorder(): TNode {
    return this.sourceNode.model.isRecorder ? this.sourceNode : this.targetNode;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  get source(): TNode | TNodeGroup | undefined {
    return this._source;
  }

  // get sourceIdx(): number {
  //   return this.source ? this.connections.network.nodes.all.indexOf(this.source) : -1;
  // }

  get sourceNode(): TNode {
    return this.source as TNode;
  }

  get sourceNodeGroup(): TNodeGroup {
    return this.source as TNodeGroup;
  }

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get target(): TNode | TNodeGroup | undefined {
    return this._target;
  }

  // get targetIdx(): number {
  //   return this.target ? this.connections.network.nodes.all.indexOf(this.target) : -1;
  // }

  get targetNode(): TNode {
    return this.target as TNode;
  }

  // set targetNode(node: TNode) {
  //   this._targetIdx = node.idx;
  // }

  get targetNodeGroup(): TNodeGroup {
    return this.target as TNodeGroup;
  }

  get view(): ConnectionView {
    return this._view;
  }

  /**
   * Observer for connection changes.
   * @remarks It emits network changes.
   */
  changes(props: { checkSynWeights?: boolean; preventSimulation?: boolean } = {}): void {
    this.logger.trace("changes");
    this.updateHash();

    if (props.checkSynWeights) this.sourceNode.view.checkSynWeights();

    this.connections.network.changes(props);
  }

  /**
   * Clean this component.
   */
  clean(): void {}

  /**
   * Initialize connection.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    // this.params.init();
    this.synapse.init();

    this.update();
  }

  /**
   * Load connection from state.
   * @param connectionState connection state
   */
  load(connectionState: IConnectionState): void {
    this._source = this.connections.network.nodes.all.find((node) => node.codeNode.id === connectionState.sourceNodeId);
    this._target = this.connections.network.nodes.all.find((node) => node.codeNode.id === connectionState.targetNodeId);

    if (connectionState.rule) this.rule.value = connectionState.rule;
    if (connectionState.params) this.params.load(connectionState.params);
    if (connectionState.synapse) this.synapse.load(connectionState.synapse);
  }

  /**
   * Set defaults.
   * @remarks It emits connection changes.
   */
  reset(): void {
    this.logger.trace("reset");

    this.rule.reset();
    this.params.reset();
  }

  /**
   * Delete connection from the network.
   */
  remove(): void {
    this.network.deleteConnection(this);
  }

  /**
   * Reverse source and target indices.
   * @remarks It emits connection changes.
   */
  reverse(): void {
    this.logger.trace("reverse");

    const target = this.target;
    const source = this.source;

    this.source = target;
    this.target = source;

    // Check syn weights.
    this.sourceNode.view.checkSynWeights();
    this.targetNode.view.checkSynWeights();

    // Initialize activity graph.
    if (this._view.connectRecorder()) this.recorder.createActivity();

    // Trigger connection change.
    this.changes({ preventSimulation: true });
  }

  /**
   * Save connection to state.
   * @return connection state
   */
  override save(): IConnectionState {
    const connectionState: IConnectionState = {
      sourceNodeId: this.source?.codeNode?.id ?? -1,
      targetNodeId: this.target?.codeNode?.id ?? -1,
    };

    if (this.params.hasSomeVisibleParams) connectionState.params = this.params.save();
    if (this.synapse.params.hasSomeVisibleParams) connectionState.synapse = this.synapse.save();

    return connectionState;
  }

  /**
   * Update connection.
   */
  update(): void {
    this.clean();
    this.updateHash();
  }
}
