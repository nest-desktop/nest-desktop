// baseConnection.ts

import { ILogObj, Logger } from "tslog";

import { Config } from "@/helpers/config";
import { Connections } from "@/types/connectionsTypes";
import { logger as mainLogger } from "@/helpers/logger";

import {
  ConnectionParameter,
  ConnectionParameterProps,
} from "./connectionParameter";
import { ConnectionRule } from "./connectionRule";
import { ConnectionState } from "./connectionState";
import { ConnectionView } from "./connectionView";
import { Node } from "@/types/nodeTypes";
import { Connection } from "@/types/connectionTypes";
import { Network } from "@/types/networkTypes";

export interface ConnectionProps {
  source: number;
  target: number;
  rule?: string;
  params?: ConnectionParameterProps[];
}

export class BaseConnection extends Config {
  private readonly _name = "Connection";

  private _idx: number; // generative
  private _logger: Logger<ILogObj>;
  private _params: { [key: string]: ConnectionParameter } = {};
  private _paramsVisible: string[] = [];
  private _rule: ConnectionRule;
  private _sourceIdx: number; // Node index
  private _state: ConnectionState;
  private _targetIdx: number; // Node index
  private _view: ConnectionView;

  public _connections: Connections; // parent

  constructor(
    connections: Connections,
    connection: ConnectionProps,
    name: string = "Connection"
  ) {
    super(name);
    this._connections = connections;
    this._idx = this.connections.all.length;

    this._logger = mainLogger.getSubLogger({
      name: `[${this.connections.network.project.shortId}] connection`,
    });

    this._state = new ConnectionState(this);
    this._view = new ConnectionView(this);

    this._sourceIdx = connection.source;
    this._targetIdx = connection.target;

    this._rule = new ConnectionRule(this, connection.rule);

    this.initParameters(connection.params);
  }

  get connections(): Connections {
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

  // get hasSomeVisibleParams(): boolean {
  //   return Object.values(this._params).some(
  //     (param: ConnectionParameter) => param.visible
  //   );
  // }

  get idx(): number {
    return this._idx;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this.connections.network;
  }

  get params(): { [key: string]: ConnectionParameter } {
    return this._params;
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get parent(): Connections {
    return this._connections;
  }

  get recorder(): Node {
    return this.source.model.isRecorder ? this.source : this.target;
  }

  get rule(): ConnectionRule {
    return this._rule;
  }

  get source(): Node {
    const nodes = this.connections.network.nodes.all as Node[];
    return nodes[this._sourceIdx];
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

  get state(): ConnectionState {
    return this._state;
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
   * Observer for connection changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this._state.updateHash();
    this._logger.trace("changes");
    this.connections.network.changes();
  }

  /**
   * Clean this component.
   */
  clean(): void {
    const connections = this.connections.all as Connection[];
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
   * Initialize parameters.
   */
  initParameters(params: ConnectionParameterProps[] = []): void {
    this._logger.trace("init parameter");
    this._paramsVisible = [];
    this._params = {};
    const ruleConfig: any = this.getRuleConfig();
    ruleConfig.params.forEach((param: ConnectionParameterProps) => {
      if (params != null) {
        const p: ConnectionParameterProps | undefined = params.find(
          (p: ConnectionParameterProps) => p.id === param.id
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
    this._logger.trace("reverse");
    [this._sourceIdx, this._targetIdx] = [this._targetIdx, this._sourceIdx];

    // Trigger connection change.
    this.changes();

    // Initialize activity graph.
    if (this._view.connectRecorder()) {
      this.recorder.initActivity();
      // this.network.project.initActivityGraph();
    }
  }

  /**
   * Set defaults.
   *
   * @remarks
   * It emits connection changes.
   */
  reset(): void {
    this._logger.trace("reset");
    this._rule.reset();
    this.initParameters();
    this.changes();
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
  toJSON(): ConnectionProps {
    const connection: ConnectionProps = {
      source: this._sourceIdx,
      target: this._targetIdx,
    };

    if (this._rule.value !== "all_to_all") {
      connection.rule = this._rule.value;
    }

    if (this._paramsVisible.length > 0) {
      connection.params = this.filteredParams.map(
        (param: ConnectionParameter) => param.toJSON()
      );
    }

    return connection;
  }
}
