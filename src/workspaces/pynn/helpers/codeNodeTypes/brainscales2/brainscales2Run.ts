// brainsales2Run.ts

import { NumberInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "brainscales2.run",
  title: "run",
  inputs: {
    time: () => new NumberInterface("time", 1).use(setType, numberType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const time = this.node.getConnectedOutputInterfacesByInterface("time");
    if (time.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(time).join(", ")}`);
    else args.push(`${this.node.inputs.time.value}`);

    return `pynn.run(${args.join(", ")})`;
  },
});
