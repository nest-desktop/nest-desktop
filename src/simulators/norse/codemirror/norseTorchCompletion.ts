// norseTorchCompletion.ts

import { CompletionContext } from "@codemirror/autocomplete";

// Our list of completions (can be static, since the editor will do filtering based on context).
const completions = [
  {
    apply: "norse.torch.LIF(",
    info: "norse.torch.LIF(p=LIFParameters(tau_syn_inv=tensor(200.), tau_mem_inv=tensor(100.), v_leak=tensor(0.), \
    v_th=tensor(1.), v_reset=tensor(0.), method='super', alpha=tensor(100.))",
    label: "norse.torch.LIF(",
    type: "function",
  },
];

export function norseTorchCompletions(context: CompletionContext) {
  const before = context.matchBefore(/norse.torch\.\w*/);
  // If completion wasn't explicitly started and there
  // is no word before the cursor, don't open completions.
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}
