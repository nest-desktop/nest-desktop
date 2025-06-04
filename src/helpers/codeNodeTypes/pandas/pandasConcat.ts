// pandasDataFrame.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { dataframeType, IPandasDataFrame } from "./interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pandas.concat",
  title: "concat",
  inputs: {
    objs: () => new NodeInputInterface("objs"),
  },
  outputs: {
    out: () => new NodeOutputInterface<IPandasDataFrame>().use(setType, dataframeType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const objs = this.node.getConnectedOutputInterfaceByInterface("objs");
    if (objs) args.push(`${this.code?.graph.formatInterfaceLabel(objs)}`);

    return `pd.concat([${args.join(", ")}])`;
  },
  variableName: "df",
});
