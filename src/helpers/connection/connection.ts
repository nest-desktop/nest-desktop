// connection.ts

import { TConnection, TConnections, TNetwork, TNode, TNodeGroup, TSynapse } from "@/types";

import { BaseObj } from "../common/base";
import { BaseSynapse, ISynapseProps } from "../synapse/synapse";
import { ConnectionParameter } from "./connectionParameter";
import { ConnectionRule, IConnectionRuleConfig } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { IConfigProps } from "../common/config";
import { IParamProps } from "../common/parameter";

export interface IConnectionProps {
  params?: IParamProps[];
  rule?: string;
  source: number;
  synapse?: ISynapseProps;
  target: number;
}

export class BaseConnection extends BaseObj {
  private readonly _name = "Connection";

  private _idx: number; // generative
  private _params: Record<string, ConnectionParameter> = {};
  private _paramsVisible: string[] = [];
  private _rule: ConnectionRule;
  private _source: TNode | TNodeGroup;
  private _sourceIdx: number; // Node index
  private _state: ConnectionState;
  private _target: TNode | TNodeGroup;
  private _targetIdx: number; // Node index
  private _view: ConnectionView;

  public _connections: TConnections; // parent
  public _synapse: TSynapse;

  constructor(connections: TConnections, connectionProps: IConnectionProps, configProps?: IConfigProps) {
    super({
      config: { name: "Connection", ...configProps },
      logger: { settings: { minLevel: 3 } },
    });

    this._connections = connections;
    this._idx = this.connections.all.length;

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this.sourceIdx = connectionProps.source;
    this.targetIdx = connectionProps.target;

    this._rule = new ConnectionRule(this, connectionProps.rule);
    this.addParameters(connectionProps.params);

    this._synapse = new this.Synapse(this, connectionProps.synapse);
  }

  get Synapse() {
    return BaseSynapse;
  }

  get connections(): TConnections {
    return this._connections;
  }

  /**
   * Returns all visible parameters.
   */
  get filteredParams(): ConnectionParameter[] {
    return this._paramsVisible.map((paramId: string) => this._params[paramId]);
  }

  get hasConnSpec(): boolean {
    return this._rule.value !== "all_to_all";
  }

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
  }

  get idx(): number {
    return this.connections.all.indexOf(this);
  }

  get name(): string {
    return this._name;
  }

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

  get params(): Record<string, ConnectionParameter> {
    return this._params;
  }

  get paramsAll(): ConnectionParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes({ preventSimulation: true });
  }

  get parent(): TConnections {
    return this._connections;
  }

  get recorder(): TNode {
    return this.sourceNode.model.isRecorder ? this.sourceNode : this.targetNode;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  get source(): TNode | TNodeGroup {
    return this._source;
  }

  set source(value: TNode | TNodeGroup) {
    this._source = value;
    this._sourceIdx = value.idx;
  }

  get sourceIdx(): number {
    return this._sourceIdx;
  }

  set sourceIdx(value: number) {
    if (value === -1) return;
    this._sourceIdx = value;
    this._source = this.connections.network.nodes.all[this._sourceIdx];
  }

  get sourceNode(): TNode {
    return this.source as TNode;
  }

  // set sourceNode(node: TNode) {
  //   this._source = node;
  //   this._sourceIdx = node.idx;
  // }

  get sourceNodeGroup(): TNodeGroup {
    return this.source as TNodeGroup;
  }

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get target(): TNode | TNodeGroup {
    return this._target;
  }

  set target(value: TNode) {
    this._target = value;
    this._targetIdx = value.idx;
  }

  get targetIdx(): number {
    return this._targetIdx;
  }

  set targetIdx(value: number) {
    if (value === -1) return;
    this._targetIdx = value;
    this._target = this.network.nodes.all[this._targetIdx];
  }

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
   * Add connection parameter.
   * @param paramProps parameter props
   */
  addParameter(paramProps: IParamProps): void {
    this._params[paramProps.id] = new ConnectionParameter(this, paramProps);
  }

  /**
   * Add connection parameters.
   * @param paramsProps list of parameter props
   */
  addParameters(paramsProps: IParamProps[] = []): void {
    this.logger.trace("init parameter");

    this._paramsVisible = [];
    this._params = {};
    const ruleConfig: IConnectionRuleConfig = this.getRuleConfig();
    ruleConfig.params.forEach((param: IParamProps) => {
      if (paramsProps != null) {
        const paramProps: IParamProps | undefined = paramsProps.find(
          (paramProps: IParamProps) => paramProps.id === param.id,
        );
        if (paramProps != null) {
          param.value = paramProps.value;
          if (paramProps.type != null) param.type = paramProps.type;
        }
        if (param && param.visible !== false) this._paramsVisible.push(param.id);
      }
      this.addParameter(param);
    });
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
  clean(): void {
    const connections = this.connections.all as TConnection[];
    this._idx = connections.indexOf(this);
  }

  // /**
  //  * Sets all params to invisible.
  //  */
  // hideAllParams(): void {
  //   Object.values(this._params).forEach(
  //     (param: ConnectionParameter) => (param.visible = false)
  //   );
  // }

  /**
   * Initialize connection.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.synapse.init();
    this.update();
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): IConnectionRuleConfig {
    return this.config?.localStorage.rules.find((r: IConnectionRuleConfig) => r.value === this._rule.value);
  }

  /**
   * Reverse source and target indices.
   * @remarks It emits connection changes.
   */
  reverse(): void {
    this.logger.trace("reverse");

    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];

    // Trigger connection change.
    this.changes();

    // Initialize activity graph.
    if (this._view.connectRecorder()) this.recorder.createActivity();
  }

  /**
   * Set defaults.
   * @remarks It emits connection changes.
   */
  reset(): void {
    this.logger.trace("reset");

    this._rule.reset();
    this.resetParams();
  }

  /**
   * Resets all parameters to their default.
   */
  resetParams(): void {
    // Reset connection parameter.
    this.paramsAll.forEach((param: ConnectionParameter) => param.reset());
  }

  /**
   * Delete connection from the network.
   */
  remove(): void {
    this.network.deleteConnection(this);
  }

  // /**
  //  * Sets all params to visible.
  //  */
  // showAllParams(): void {
  //   Object.values(this._params).forEach(
  //     (param: ConnectionParameter) => (param.visible = true)
  //   );
  // }

  /**
   * Serialize for JSON.
   * @return connection props
   */
  toJSON(): IConnectionProps {
    const connectionProps: IConnectionProps = {
      source: this._sourceIdx,
      target: this._targetIdx,
    };

    if (this._rule.value !== "all_to_all") connectionProps.rule = this._rule.value;

    if (this._paramsVisible.length > 0)
      connectionProps.params = this.filteredParams.map((param: ConnectionParameter) => param.toJSON());

    return connectionProps;
  }

  /**
   * Update connection.
   */
  update(): void {
    this.clean();
    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    const hashProps: {
      idx: number;
      params: IParamProps[];
      synapse: string;
      sourceModelId?: string;
      targetModelId?: string;
    } = {
      idx: this.idx,
      params: this.paramsAll.map((param: ConnectionParameter) => param.toJSON()),
      synapse: this.synapse.hash,
    };

    if (this.source.isNode) hashProps.sourceModelId = this.sourceNode.modelId;
    if (this.target.isNode) hashProps.targetModelId = this.targetNode.modelId;

    this._updateHash(hashProps);
  }
}
