// connection.ts

import { BaseObj } from "../common/base";
import { IConfigProps } from "../common/config";
import { BaseSynapse, ISynapseProps } from "../synapse/synapse";
import {
  ConnectionParameter,
  IConnectionParamProps,
} from "./connectionParameter";
import { ConnectionRule } from "./connectionRule";
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
    return this.source.model.isRecorder ? this.source : this.target;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  get source(): TNode {
    const nodes = this.connections.network.nodes.all as TNode[];
    return nodes[this._sourceIdx];
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

  get state(): ConnectionState {
    return this._state;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get target(): TNode {
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

  get view(): ConnectionView {
    return this._view;
  }

  /**
   * Add connection parameter.
   */
  addParameter(paramProps: IConnectionParamProps): void {
    this._params[paramProps.id] = new ConnectionParameter(this, paramProps);
  }

  /**
   * Add connection parameters.
   */
  addParameters(paramProps: IConnectionParamProps[] = []): void {
    this.logger.trace("init parameter");
    this._paramsVisible = [];
    this._params = {};
    const ruleConfig: any = this.getRuleConfig();
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

  init(): void {
    this.logger.trace("init");
    this.reset();
    this.synapse.init();
    this.update();
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): any {
    return this.config?.localStorage.rules.find(
      (r: any) => r.value === this._rule.value
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
    const ruleConfig: any = this.getRuleConfig();

    // Reset connection parameter.
    this.paramsAll.forEach((param: ConnectionParameter) => {
      param.reset();
      const p: any = ruleConfig.params.find((p: any) => p.id === param.id);
      param.value = p.value;
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
   * @return connection object
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
    this._updateHash({
      idx: this.idx,
      params: this.paramsAll.map((param: ConnectionParameter) =>
        param.toJSON()
      ),
      synapse: this.synapse.hash,
      sourceModelId: this.source.modelId,
      targetModelId: this.target.modelId,
    });
  }
}
