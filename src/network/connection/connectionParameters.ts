// connectionParameters.ts

import type { ICodeMaskParamState } from "@/codeGraph";
import { BaseParameters } from "@/parameter";

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
  override load(paramStates?: Record<string, ICodeMaskParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();
    const ruleConfig: IConnectionRuleConfig = this.connection.rule.getRuleConfig();
    ruleConfig.params.forEach((param: ICodeMaskParamState) => {
      if (paramStates != null) {
        const paramState: ICodeMaskParamState | undefined = paramStates[param.id];
        if (paramState != null) {
          param.value = paramState.value;
          if (paramState.type != null) param.type = paramState.type;
        }
      }
      this.addParameter(param);
    });
  }
}
