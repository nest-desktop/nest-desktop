// connectionRule.ts

import { TConnection } from "@/types/connectionTypes";

enum Rule {
  AllToAll = "all_to_all",
  FixedIndegree = "fixed_indegree",
  FixedOutdegree = "fixed_outdegree",
  FixedTotalNumber = "fixed_total_number",
  OneToOne = "one_to_one",
  PairwiseBernoulli = "pairwise_bernoulli",
  symmetricPairwiseBernoulli = "symmetric_pairwise_bernoulli",
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
    this.connection.addParameters();
    this.connection.changes();
  }

  reset(): void {
    this._value = Rule.AllToAll;
  }
}
