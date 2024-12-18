// Our list of completions (can be static, since the editor
/// will do filtering based on context).
const completions = [
  {
    apply: "nest.spatial.free(",
    info: "nest.spatial.free(pos, extent=None, edge_wrap=False, num_dimensions=None)",
    label: "nest.spatial.free(",
    type: "function",
  },
  {
    apply: "nest.spatial.grid(",
    info: "nest.spatial.grid(shape, center=None, extent=None, edge_wrap=False)",
    label: "nest.spatial.grid(",
    type: "function",
  },
];

export function nestSpatialCompletions(context: any) {
  const before = context.matchBefore(/nest\.spatial\.\w*/);
  // If completion wasn't explicitly started and there
  // is no word before the cursor, don't open completions.
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}
