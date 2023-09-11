// connectionRule.ts

import { Connection } from "@/types/connectionTypes";

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
  private _connection: Connection; // parent
  private _value: string;

  constructor(connection: Connection, rule?: string) {
    this._connection = connection;
    this._value = rule || "all_to_all";
  }

  get connection(): Connection {
    return this._connection as Connection;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.connection.initParameters();
    this.connection.changes();
  }

  reset(): void {
    this._value = Rule.AllToAll;
  }
}
