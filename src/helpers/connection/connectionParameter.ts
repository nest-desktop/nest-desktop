// connectionParameter.ts

import { TConnection } from "@/types";

import { IParamProps, IParamType, Parameter } from "../common/parameter";
import { IConnectionRuleConfig } from "./connectionRule";

export interface IConnectionParamProps extends IParamProps {}

export class ConnectionParameter extends Parameter {
  public _connection: TConnection;

  constructor(connection: TConnection, paramProps: IConnectionParamProps) {
    super(paramProps, { minLevel: 3 });
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
    const p = ruleConfig.params.find(
      (p: IConnectionParamProps) => p.id === this.id
    );

    if (p?.value) {
      this.state.value = p.value;
    } else if (this.options) {
      this.state.value = this.options.defaultValue;
    }
  }
}
