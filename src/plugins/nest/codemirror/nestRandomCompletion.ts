// Our list of completions (can be static, since the editor
/// will do filtering based on context).
const completions = [
  {
    apply: "nest.random.exponential",
    info: "nest.random.exponential(beta=1.0)",
    label: "nest.random.exponential()",
    type: "function",
  },
  {
    apply: "nest.random.lognormal",
    info: "nest.random.lognormal(mean=0.0, std=1.0)",
    label: "nest.random.lognormal()",
    type: "function",
  },
  {
    apply: "nest.random.normal",
    info: "nest.random.normal(mean=0.0, std=1.0)",
    label: "nest.random.normal()",
    type: "function",
  },
  {
    apply: "nest.random.uniform",
    info: "nest.random.uniform(min=0.0, max=1.0)",
    label: "nest.random.uniform()",
    type: "function",
  },
  {
    apply: "nest.random.uniform_int",
    info: "nest.random.uniform_int(max)",
    label: "nest.random.uniform_int()",
    type: "function",
  },
];

export function nestRandomCompletions(context: any) {
  const before = context.matchBefore(/nest\.random\.\w*/);
  // If completion wasn't explicitly started and there
  // is no word before the cursor, don't open completions.
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}
