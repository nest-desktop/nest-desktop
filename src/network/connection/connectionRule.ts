// connectionRule.ts

import type { IParamState } from "@/parameter";
import type { TConnection } from "@/types";
import { ICodeNodeParamState, updateNESTParameterNode } from "@/workspaces/nest/codeNodeTypes/nest";
import { nextTick } from "vue";

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

    if (!this.connection.codeNode) return;
    if (this.connection.codeNode.inputs.conn_spec) this.connection.codeNode.inputs.conn_spec.value = value;

    const ruleConfig = this.getRuleConfig();

    let conn_spec: Record<string, ICodeNodeParamState> = {};
    if (!["all_to_all", "one_to_one"].includes(value)) conn_spec = { rule: { id: "rule", value: value } };
    if (ruleConfig.params)
      Object.entries(ruleConfig.params).forEach(([paramId, param]: [string, IParamState]) => {
        const state: ICodeNodeParamState = {
          id: param.id,
          value: param.value,
          hidden: param.hidden ?? true,
        };
        if (param.codeNodeInterface) state.component = param.codeNodeInterface;
        if (param.min) state.min = param.min;
        if (param.max) state.max = param.max;
        if (param.step) state.step = param.step;
        conn_spec[paramId] = state;
      });

    updateNESTParameterNode(this.connection.codeNode, "conn_spec", conn_spec);
    this.connection.codeNode?.inputs.conn_spec?.setHidden(value === "all_to_all");

    this.connection.params.load(ruleConfig.params);

    nextTick(() => this.connection.codeNode.code.engine.runOnce({}));
  }

  /**
   * Get all parameter of the rule.
   */
  getRuleConfig(): IConnectionRuleConfig {
    return this.connection.config?.localStorage.rules.find((r: IConnectionRuleConfig) => r.value === this.value);
  }

  // load(value: Rule) {
  //   this._value = value;
  // }

  /**
   * Reset connection rule.
   */
  reset(): void {
    this._value = Rule.AllToAll;
  }
}
