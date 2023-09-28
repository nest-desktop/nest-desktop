// Our list of completions (can be static, since the editor
/// will do filtering based on context).
const completions = [
  {
    apply: "nest.spatial_distributions.exponential",
    info: "nest.spatial_distributions.exponential(x, beta=1.0)",
    label: "nest.spatial_distributions.exponential()",
    type: "function",
  },
  {
    apply: "nest.spatial_distributions.gamma",
    info: "nest.spatial_distributions.gamma(x, kappa=1.0, theta=1.0)",
    label: "nest.spatial_distributions.gamma()",
    type: "function",
  },
  {
    apply: "nest.spatial_distributions.gaussian",
    info: "nest.spatial_distributions.gaussian(x, mean=0.0, std=1.0)",
    label: "nest.spatial_distributions.gaussian()",
    type: "function",
  },
  {
    apply: "nest.spatial_distributions.gaussian2D",
    info: "nest.spatial_distributions.gaussian2D(x, y, mean_x=0.0, mean_y=0.0, std_x=1.0, std_y=1.0, rho=0.0)",
    label: "nest.spatial_distributions.gaussian2D()",
    type: "function",
  },
];

export function nestSpatialDistributionsCompletions(context: any) {
  const before = context.matchBefore(/nest\.spatial_distributions\.\w*/);
  // If completion wasn't explicitly started and there
  // is no word before the cursor, don't open completions.
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}
