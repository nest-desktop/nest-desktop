// connectionRule.ts

import { IParamProps } from "../common/parameter";
import { TConnection } from "@/types";

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
  params: IParamProps[];
}

export class ConnectionRule {
  private _connection: TConnection; // parent
  private _value: string;

  constructor(connection: TConnection, rule?: string) {
    this._connection = connection;
    this._value = rule || "all_to_all";
  }

  get connection(): TConnection {
    return this._connection as TConnection;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.connection.initParameters();
    this.connection.changes();
  }

  /**
   * Reset connection rule.
   */
  reset(): void {
    this._value = Rule.AllToAll;
  }
}
