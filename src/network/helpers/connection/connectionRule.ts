// connectionRule.ts

import type { IParamState } from "@/parameter";
import type { TConnection } from "@/types";

enum Rule {
  AllToAll = "all_to_all",
  FixedIndegree = "fixed_indegree",
  FixedOutdegree = "fixed_outdegree",
  FixedTotalNumber = "fixed_total_number",
  OneToOne = "one_to_one",
  PairwiseBernoulli = "pairwise_bernoulli",
  symmetricPairwiseBernoulli = "symmetric_pairwise_bernoulli",
}

export interface IConnectionRuleConfig {
  value: string;
  label: string;
  params: IParamState[];
}

export class ConnectionRule {
  private _connection: TConnection; // parent
  private _value: string = "all_to_all";

  constructor(connection: TConnection) {
    this._connection = connection;
  }

  get connection(): TConnection {
    return this._connection as TConnection;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.connection.params.load();
    this.connection.changes();
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): IConnectionRuleConfig {
    return this.connection.config?.localStorage.rules.find((r: IConnectionRuleConfig) => r.value === this._value);
  }

  load(value: Rule) {
    this._value = value;
  }

  /**
   * Reset connection rule.
   */
  reset(): void {
    this._value = Rule.AllToAll;
  }
}
