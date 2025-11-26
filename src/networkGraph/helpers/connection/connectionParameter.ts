// connectionParameter.ts

import { BaseParameter, type IParamState, type IParamType } from "@/helpers/common";

import type { IConnectionRuleConfig } from "./connectionRule";
import { ConnectionParameters } from "./connectionParameters";

export class ConnectionParameter extends BaseParameter {
  public _connectionParams: ConnectionParameters;

  constructor(connectionParams: ConnectionParameters) {
    super();

    this._connectionParams = connectionParams;
  }

  get connectionParams(): ConnectionParameters {
    return this._connectionParams as ConnectionParameters;
  }

  override get parent(): ConnectionParameters {
    return this.connectionParams;
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

    const ruleConfig: IConnectionRuleConfig = this.connectionParams.connection.rule.getRuleConfig();
    const p = ruleConfig.params.find((p: IParamState) => p.id === this.id);

    if (p?.value) {
      this.state.value = p.value;
    } else if (this.options) {
      this.state.value = this.options.defaultValue;
    }
  }
}
