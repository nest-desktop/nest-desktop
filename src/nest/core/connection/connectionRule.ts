// connectionRule.ts

import { Connection } from "./connection";

enum Rule {
  AllToAll = "all_to_all",
  FixedIndegree = "fixed_indegree",
  FixedOutdegree = "fixed_outdegree",
  FixedTotalNumber = "fixed_total_number",
  OneToOne = "one_to_one",
  PairwiseBernoulli = "pairwise_bernoulli",
  symmetricPairwiseBernoulli = "symmetric_pairwise_bernoulli",
}

const rulesPyNN: { [key: string]: string } = {
  all_to_all: "AllToAll",
  one_to_one: "OneToOne",
  fixed_indegree: "FixedNumberPost",
  fixed_outdegree: "FixedNumberPre",
  fixed_total_number: "FixedTotalNumber",
  pairwise_bernoulli: "FixedProbability",
  symmetric_pairwise_bernoulli: "FixedProbability",
};

export class ConnectionRule {
  private _connection: Connection; // parent
  private _value: string;

  constructor(connection: Connection, rule: string) {
    this._connection = connection;
    this._value = rule || "all_to_all";
  }

  get toPyNN(): string {
    return rulesPyNN[this._value];
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this._connection.initParameters();
  }

  reset(): void {
    this._value = Rule.AllToAll;
  }
}
