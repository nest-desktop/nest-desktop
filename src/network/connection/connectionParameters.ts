// connectionParameters.ts

import { BaseParameters, type IParamState } from "@/parameter";

import type { BaseConnection } from "./connection";
import type { IConnectionRuleConfig } from "./connectionRule";
import { ConnectionParameter } from "./connectionParameter";

export class ConnectionParameters<
  TConnection extends BaseConnection = BaseConnection,
> extends BaseParameters<ConnectionParameter> {
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
