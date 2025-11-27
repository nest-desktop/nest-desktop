// connectionParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { TConnection } from "@/types";
import { IConnectionRuleConfig } from "./connectionRule";
import { ConnectionParameter } from "./connectionParameter";

export class ConnectionParameters extends BaseParameters {
  public _connection: TConnection;

  constructor(connection: TConnection) {
    super();

    this._connection = connection;
  }

  override get Parameter() {
    return ConnectionParameter;
  }

  get connection(): TConnection {
    return this._connection;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.connection.changes(props);
  }

  /**
   * Load parameters from state.
   * @param paramStates parameter states
   */
  override load(paramStates?: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();
    const ruleConfig: IConnectionRuleConfig = this.connection.rule.getRuleConfig();
    ruleConfig.params.forEach((param: IParamState) => {
      if (paramStates != null) {
        const paramState: IParamState | undefined = paramStates[param.id];
        if (paramState != null) {
          param.value = paramState.value;
          if (paramState.type != null) param.type = paramState.type;
        }
      }
      this.addParameter(param);
    });
  }
}
