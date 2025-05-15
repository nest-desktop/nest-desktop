// pandasDataFrame.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { dataframeType, IPandasDataFrame } from "./interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pandas.DataFrame",
  title: "data frame",
  inputs: {
    data: () => new NodeInputInterface("data"),
  },
  outputs: {
    out: () => new NodeOutputInterface<IPandasDataFrame>().use(setType, dataframeType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const data = this.node.getConnectedOutputInterfaceByInterface("data");
    if (data && data.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(data).join(", ")}`);

    return `pd.DataFrame(${args.join(", ")})`;
  },
  variableName: "df",
});
