// connection.ts

import { BaseObj } from "../common/base";
import { IConfigProps } from "../common/config";
import { IParamProps } from "../common/parameter";
import { NodeGroup } from "../node/nodeGroup";
import { BaseSynapse, ISynapseProps } from "../synapse/synapse";
import {
  ConnectionParameter,
  IConnectionParamProps,
} from "./connectionParameter";
import { ConnectionRule, IConnectionRuleConfig } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { TConnection } from "@/types/connectionTypes";
import { TConnections } from "@/types/connectionsTypes";
import { TNetwork } from "@/types/networkTypes";
import { TNode } from "@/types/nodeTypes";
import { TSynapse } from "@/types/synapseTypes";

export interface IConnectionProps {
  params?: IConnectionParamProps[];
  rule?: string;
  source: number;
  synapse?: ISynapseProps;
  target: number;
}

export class BaseConnection extends BaseObj {
  private readonly _name = "Connection";

  private _idx: number; // generative
  private _params: { [key: string]: ConnectionParameter } = {};
  private _paramsVisible: string[] = [];
  private _rule: ConnectionRule;
  private _sourceIdx: number; // Node index
  private _state: ConnectionState;
  private _targetIdx: number; // Node index
  private _view: ConnectionView;

  public _connections: TConnections; // parent
  public _synapse: TSynapse;

  constructor(
    connections: TConnections,
    connectionProps: IConnectionProps,
    configProps?: IConfigProps
  ) {
    super({
      config: { name: "Connection", ...configProps },
      logger: { settings: { minLevel: 3 } },
    });

    this._connections = connections;
    this._idx = this.connections.all.length;

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connectionProps.source;
    this._targetIdx = connectionProps.target;

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
    return this._idx;
  }

  get name(): string {
    return this._name;
  }

  get nodeGroups(): NodeGroup[] {
    return this.network.nodes.nodeGroups.filter((nodeGroup: NodeGroup) => {
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

  get params(): { [key: string]: ConnectionParameter } {
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
    this.changes();
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

  get source(): NodeGroup | TNode {
    return this.connections.network.nodes.all[this._sourceIdx];
  }

  set source(node: TNode) {
    this._sourceIdx = node.idx;
  }

  get sourceIdx(): number {
    return this._sourceIdx;
  }

  set sourceIdx(value: number) {
    this._sourceIdx = value;
  }

  get sourceNode(): TNode {
    return this.connections.network.nodes.all[this._sourceIdx] as TNode;
  }

  set sourceNode(node: TNode) {
    this._sourceIdx = node.idx;
  }

  get sourceNodeGroup(): NodeGroup {
    return this.connections.network.nodes.all[this._sourceIdx] as NodeGroup;
  }

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get target(): NodeGroup | TNode {
    return this.network.nodes.all[this._targetIdx];
  }

  set target(node: TNode) {
    this._targetIdx = node.idx;
  }

  get targetIdx(): number {
    return this._targetIdx;
  }

  set targetIdx(value: number) {
    this._targetIdx = value;
  }

  get targetNode(): TNode {
    return this.network.nodes.all[this._targetIdx] as TNode;
  }

  set targetNode(node: TNode) {
    this._targetIdx = node.idx;
  }

  get targetNodeGroup(): NodeGroup {
    return this.connections.network.nodes.all[this._targetIdx] as NodeGroup;
  }

  get view(): ConnectionView {
    return this._view;
  }

  /**
   * Add connection parameter.
   * @param paramProps
   */
  addParameter(paramProps: IConnectionParamProps): void {
    this._params[paramProps.id] = new ConnectionParameter(this, paramProps);
  }

  /**
   * Add connection parameters.
   * @param paramProps
   */
  addParameters(paramProps: IConnectionParamProps[] = []): void {
    this.logger.trace("init parameter");

    this._paramsVisible = [];
    this._params = {};
    const ruleConfig: IConnectionRuleConfig = this.getRuleConfig();
    ruleConfig.params.forEach((param: IConnectionParamProps) => {
      if (paramProps != null) {
        const p: IConnectionParamProps | undefined = paramProps.find(
          (p: IConnectionParamProps) => p.id === param.id
        );
        if (p != null) {
          param.value = p.value;
          if (p.type != null) {
            param.type = p.type;
          }
        }
        if (param && param.visible !== false) {
          this._paramsVisible.push(param.id);
        }
      }
      this.addParameter(param);
    });
  }

  /**
   * Observer for connection changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this.updateHash();
    this.logger.trace("changes");

    this.connections.network.changes();
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
    return this.config?.localStorage.rules.find(
      (r: IConnectionRuleConfig) => r.value === this._rule.value
    );
  }

  /**
   * Reverse source and target indices.
   *
   * @remarks
   * It emits connection changes.
   */
  reverse(): void {
    this.logger.trace("reverse");

    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];

    // Trigger connection change.
    this.changes();

    // Initialize activity graph.
    if (this._view.connectRecorder()) {
      this.recorder.createActivity();
    }
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  reset(): void {
    this.logger.trace("reset");

    this._rule.reset();
    this.resetParams();
  }

  /**
   * Resets parameters to their default.
   */
  resetParams(): void {
    const ruleConfig: IConnectionRuleConfig = this.getRuleConfig();

    // Reset connection parameter.
    this.paramsAll.forEach((param: ConnectionParameter) => {
      param.reset();

      const p = ruleConfig.params.find(
        (p: IConnectionParamProps) => p.id === param.id
      );

      if (p?.value) {
        param.value = p.value;
      }
    });
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

    if (this._rule.value !== "all_to_all") {
      connectionProps.rule = this._rule.value;
    }

    if (this._paramsVisible.length > 0) {
      connectionProps.params = this.filteredParams.map(
        (param: ConnectionParameter) => param.toJSON()
      );
    }

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
      params: this.paramsAll.map((param: ConnectionParameter) =>
        param.toJSON()
      ),
      synapse: this.synapse.hash,
    };

    if (this.source.isNode) {
      hashProps.sourceModelId = this.sourceNode.modelId;
    }

    if (this.target.isNode) {
      hashProps.targetModelId = this.targetNode.modelId;
    }

    this._updateHash(hashProps);
  }
}
