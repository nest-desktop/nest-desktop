// nestCompletion.ts

import { CompletionContext } from "@codemirror/autocomplete";

// Our list of completions (can be static, since the editor will do filtering based on context).
const completions = [
  {
    apply: "nest.Connect(",
    info: "nest.Connect(pre, post, conn_spec=None, syn_spec=None, return_synapsecollection=False)",
    label: "nest.Connect(",
    type: "function",
  },
  {
    apply: "nest.CopyModel(",
    info: "nest.CopyModel(existing, new, params=None)",
    label: "nest.CopyModel(",
    type: "function",
  },
  {
    apply: "nest.Create(",
    info: "nest.Create(model, n=1, params=None, positions=None)",
    label: "nest.Create(",
    type: "function",
  },
  {
    apply: "nest.GetConnections(",
    info: "nest.GetConnections(source=None, target=None, synapse_model=None, synapse_label=None",
    label: "nest.GetConnections(",
    type: "function",
  },
  {
    apply: "nest.GetDefaults(",
    info: "nest.GetDefaults(model, keys=None, output='')",
    label: "nest.GetDefaults(",
    type: "function",
  },
  {
    apply: "nest.GetKernelStatus(",
    info: "nest.GetKernelStatus(keys=None)",
    label: "nest.GetKernelStatus(",
    type: "function",
  },
  {
    apply: "nest.GetNodes(",
    info: "nest.GetNodes(properties={}, local_only=False)",
    label: "nest.GetNodes(",
    type: "function",
  },
  {
    apply: "nest.GetPosition(",
    info: "nest.GetPosition(nodes)",
    label: "nest.GetPosition(",
    type: "function",
  },
  {
    apply: "nest.GetStatus(",
    info: "nest.GetStatus(nodes, keys=None, output='')",
    label: "nest.GetStatus(",
    type: "function",
  },
  {
    apply: "nest.Install(",
    info: "nest.Install(module_name)",
    label: "nest.Install(",
    type: "function",
  },
  {
    apply: "nest.Models()",
    info: "nest.Models()",
    label: "nest.Models()",
    type: "function",
  },
  {
    apply: "nest.ResetKernel()",
    info: "nest.ResetKernel()",
    label: "nest.ResetKernel()",
    type: "function",
  },
  {
    apply: "nest.SetDefaults(",
    info: "nest.SetDefaults(model, params, val=None)",
    label: "nest.SetDefaults(",
    type: "function",
  },
  {
    apply: "nest.SetKernelStatus(",
    info: "nest.SetKernelStatus(params)",
    label: "nest.SetKernelStatus(",
    type: "function",
  },
  {
    apply: "nest.SetStatus(",
    info: "nest.SetStatus(object, params, val=None)",
    label: "nest.SetStatus(",
    type: "function",
  },
  {
    apply: "nest.Simulate(",
    info: "nest.Simulate(t)",
    label: "nest.Simulate(",
    type: "function",
  },
  { label: "nest.biological_time", info: "float", type: "variable" },
  {
    apply: "nest.get(",
    info: "nest.get(*args)",
    label: "nest.get(",
    type: "function",
  },
  { label: "nest.local_num_threads", info: "int", type: "variable" },
  { label: "nest.node_models", type: "variable" },
  { label: "nest.random", type: "class" },
  { label: "nest.resolution", info: "float", type: "variable" },
  { label: "nest.rng_seed", info: "int", type: "variable" },
  {
    apply: "nest.set(",
    info: "nest.set(**kwargs)",
    label: "nest.set(",
    type: "function",
  },
  { label: "nest.spatial", type: "class" },
  { label: "nest.spatial_distributions", type: "class" },
  { label: "nest.synapse_models", type: "variable" },
  { label: "nest.userdict", info: "dict", type: "variable" },
];

export function nestCompletions(context: CompletionContext) {
  const before = context.matchBefore(/nest\.\w*/);
  // If completion wasn't explicitly started and there
  // is no word before the cursor, don't open completions.
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}
