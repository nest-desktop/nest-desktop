// connectionParameter.ts

import { CodeMaskParameter } from "@/codeGraph";
import { type IParamState, type IParamType } from "@/parameter";

import type { IConnectionRuleConfig } from "./connectionRule";
import type { ConnectionParameters } from "./connectionParameters";

export class ConnectionParameter<
  TParent extends ConnectionParameters = ConnectionParameters,
> extends CodeMaskParameter<TParent> {
  get connectionParams(): TParent {
    return this.parent;
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
