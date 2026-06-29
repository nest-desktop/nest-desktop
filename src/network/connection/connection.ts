// connection.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import type { Class, TNetwork, TNode, TSynapse } from "@/types";
import type { IBaseState, IConfigState } from "@/core";
import { CodeNodeMask, type ICodeMaskParamState } from "@/codeGraph";

import { BaseSynapse, type ISynapseState } from "../synapse";
import { ConnectionRule } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { ConnectionParameters } from "./connectionParameters";
import type { BaseConnections } from "./connections";

export interface IConnectionState extends IBaseState {
  params?: Record<string, ICodeMaskParamState>;
  rule?: string;
  sourceId?: string;
  sourceIdx?: number;
  synapse?: ISynapseState;
  targetId?: string;
  targetIdx?: number;
}

export class BaseConnection<
  TConnections extends BaseConnections = BaseConnections,
  TState extends IConnectionState = IConnectionState,
> extends CodeNodeMask<TState> {
  private _params: ConnectionParameters;
  private _rule: ConnectionRule;
  private _sourceId: string | undefined;
  private _state: ConnectionState;
  private _targetId: string | undefined;
  private _view: ConnectionView;

  public _connections: TConnections; // parent
  public _synapse: BaseSynapse;

  constructor(connections: TConnections, configState?: IConfigState) {
    super({ config: { name: "Connection", ...configState } });

    this._connections = connections;

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._rule = new ConnectionRule(this);
    this._params = new this.ConnectionParameters(this);
    this._synapse = new this.Synapse(this);
  }

  get ConnectionParameters(): Class<ConnectionParameters> {
    return ConnectionParameters;
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

  get idx(): number {
    return this.connections.all.indexOf(this);
  }

  // get name(): string {
  //   return this._name;
  // }

  // get nodeGroups(): TNodeGroup[] {
  //   return this.network.nodes.nodeGroups.filter((nodeGroup: TNodeGroup) => {
  //     const nodes = nodeGroup.nodeItemsDeep;
  //     return (
  //       [this.sourceNodeGroup, this.targetNodeGroup].includes(nodeGroup) ||
  //       nodes.includes(this.sourceNode) ||
  //       nodes.includes(this.targetNode)
  //     );
  //   });
  // }

  get network(): TNetwork {
    return this.connections.network;
  }

  get params(): ConnectionParameters {
    return this._params;
  }

  get parent(): TConnections {
    return this.connections;
  }

  get recorder(): TNode | undefined {
    return this.sourceNode?.model.isRecorder ? this.sourceNode : this.targetNode;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  get sourceCodeNode(): AbstractCodeNode | undefined {
    return this.codeNode?.getConnectedNodeByInterface("pre", "inputs");
  }

  get source(): TNode | undefined {
    return this.sourceCodeNode?.mask as TNode;
  }

  get sourceId(): string | undefined {
    return this.sourceCodeNode?.id ?? this._sourceId;
  }

  get sourceNode(): TNode | undefined {
    return this.source;
  }

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get target(): TNode | undefined {
    return this.targetCodeNode?.mask as TNode;
  }

  get targetCodeNode(): AbstractCodeNode | undefined {
    return this.codeNode?.getConnectedNodeByInterface("post", "inputs");
  }

  get targetId(): string | undefined {
    return this.targetCodeNode?.id ?? this._targetId;
  }

  get targetNode(): TNode | undefined {
    return this.target;
  }

  get view(): ConnectionView {
    return this._view;
  }

  // /**
  //  * Observer for connection changes.
  //  * @remarks It emits network changes.
  //  */
  // changes(props: { checkSynWeights?: boolean; preventSimulation?: boolean } = {}): void {
  //   this.logger.trace("changes");
  //   // this.updateHash();

  //   if (props.checkSynWeights) this.sourceNode?.view.checkSynWeights();

  //   // this.connections.network.changes(props);
  // }

  /**
   * Clean this component.
   */
  clean(): void {
    // Correct connections with recorder.
    if (this.view.connectRecorder()) this.recorder?.correctRecorderConnections();
    // // Update synaptic weight label.
    // if (connection.sourceNode.isNode && connection.sourceNode.view.state.synWeights)
    //   connection.synapse.weightLabel = connection.sourceNode.view.state.synWeights;
    // // Update recorder and clean activity panels.
    // if (this.view.connectRecorder()) this.recorder?.updateRecorder();
  }

  // /**
  //  * Initialize connection.
  //  * @remarks Do not use it in the constructor.
  //  */
  // init(): void {
  //   this.logger.trace("init");

  //   // this.params.init();
  //   // this.synapse.init();

  //   // this.update();
  // }

  getCodeNodeById(nodeId: string): AbstractCodeNode | undefined {
    return this.connections.network.nodes.codeNodeIds[nodeId];
  }

  /**
   * Load connection from state.
   * @param connectionState connection state
   */
  load(connectionState: IConnectionState): void {
    this.logger.trace("load");
    if (connectionState.sourceId) this._sourceId = connectionState.sourceId;
    if (connectionState.targetId) this._targetId = connectionState.targetId;
    if (connectionState.rule) this.rule.value = connectionState.rule;
    if (connectionState.params) this.params.load(connectionState.params);
    if (connectionState.synapse) this.synapse.load(connectionState.synapse);
  }

  /**
   * Set defaults.
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
   */
  reverse(): void {
    this.logger.trace("reverse");
    if (!this.codeNode) return;

    const source = this.sourceCodeNode;
    const target = this.targetCodeNode;

    this.codeNode.graph.addConnection(target?.outputs.out, this.codeNode.inputs.pre);
    this.codeNode.graph.addConnection(source?.outputs.out, this.codeNode.inputs.post);

    // this.clean();

    // Check syn weights.
    this.sourceNode?.view.checkSynWeights();
    this.targetNode?.view.checkSynWeights();

    // Initialize activity graph.
    if (this.view.connectRecorder()) this.recorder?.createActivity();
  }

  /**
   * Save connection to state.
   * @return connection state
   */
  override save(): IConnectionState {
    const connectionState: IConnectionState = {
      sourceId: this.sourceId,
      targetId: this.targetId,
    };

    if (this.params.hasSomeVisibleParams) connectionState.params = this.params.save();
    if (this.synapse.params.hasSomeVisibleParams) connectionState.synapse = this.synapse.save();

    return connectionState;
  }

  // /**
  //  * Update connection.
  //  */
  // update(): void {
  //   this.clean();
  // }
}
