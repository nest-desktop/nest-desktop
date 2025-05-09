// connectionParameter.ts

import { TConnection } from "@/types";

import { BaseParameter, IParamProps, IParamType } from "../common/parameter";
import { IConnectionRuleConfig } from "./connectionRule";

export class ConnectionParameter extends BaseParameter {
  public _connection: TConnection;

  constructor(connection: TConnection, paramProps: IParamProps) {
    super(paramProps);
    this._connection = connection;
  }

  get connection(): TConnection {
    return this._connection as TConnection;
  }

  override get parent(): TConnection {
    return this.connection;
  }

  get types(): IParamType[] {
    const types: IParamType[] = this.config?.localStorage.types;
    return types;
  }

  /**
   * Reset value taken from options.
   */
  override reset(): void {
    this.typeId = "constant";

    const ruleConfig: IConnectionRuleConfig = this.connection.getRuleConfig();
    const p = ruleConfig.params.find((p: IParamProps) => p.id === this.id);

    if (p?.value) {
      this.state.value = p.value;
    } else if (this.options) {
      this.state.value = this.options.defaultValue;
    }
  }
}
