// pynnNESTIFCurrAlpha.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "pyNN.nest.IF_curr_alpha",
  modules: ["pyNN.nest"],
  title: "IF curr alpha",
  inputs: {
    tau_m: () => new NumberInterface("tau_m", 20.0).use(displayInSidebar, true).setHidden(true), // (ms)
    tau_syn_E: () => new NumberInterface("tau_syn_E", 2.0).use(displayInSidebar, true).setHidden(true), // (ms)
    tau_syn_I: () => new NumberInterface("tau_syn_I", 4.0).use(displayInSidebar, true).setHidden(true), // (ms)
    e_rev_E: () => new NumberInterface("e_rev_E", 0.0).use(displayInSidebar, true).setHidden(true), // (mV)
    e_rev_I: () => new NumberInterface("e_rev_I", -70.0).use(displayInSidebar, true).setHidden(true), // (mV)
    tau_refrac: () => new NumberInterface("tau_refrac", 2.0).use(displayInSidebar, true).setHidden(true), // (ms)
    v_rest: () => new NumberInterface("v_rest", -60.0).use(displayInSidebar, true).setHidden(true), // (mV)
    v_reset: () => new NumberInterface("v_reset", -70.0).use(displayInSidebar, true).setHidden(true), // (mV)
    v_thresh: () => new NumberInterface("v_thresh", -50.0).use(displayInSidebar, true).setHidden(true), // (mV)
    cm: () => new NumberInterface("cm", 0.5).use(displayInSidebar, true).setHidden(true), // (nF)
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const params = this.node.inputs;
    const paramKeys = Object.keys(params);
    paramKeys.forEach((paramKey) => {
      const param = params[paramKey];
      if (!param.hidden) args.push(`"${paramKey}": ${param.value}`);
    });

    return args.length > 0 ? `pyNN.nest.IF_curr_alpha(**{\n\t${args.join(",\n\t")}\n})` : "pyNN.nest.IF_curr_alpha()";
  },
});
