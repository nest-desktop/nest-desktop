export function CodeFICurve(model: string): string {
  const lines: string[] = [];
  lines.push('nest.ResetKernel()');
  lines.push(`neurons = nest.Create(${model}, 1000)`);
  lines.push('dc = nest.Create("dc_generator", 1000)');
  lines.push('amplitude = np.arange(1.,1001.).tolist()');
  lines.push('nest.SetStatus(dc, {"amplitude": amplitude})');
  lines.push('sd = nest.Create("spike_detector")');
  lines.push('nest.Connect(dc, neurons, "one_to_one")');
  lines.push('nest.Connect(neurons, sd)');
  lines.push('nest.Simulate(1000.)');
  lines.push('events = nest.GetStatus(sd, "events")');
  lines.push('response = {"events": events}');
  return lines.join('\n');
}
