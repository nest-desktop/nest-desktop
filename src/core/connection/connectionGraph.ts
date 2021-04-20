export function drawPath(source: any, target: any, config: any = {}): string {
  const r: number = config.radius || 18;

  const x1: number = source.x;
  let y1: number = source.y;
  const x2: number = target.x;
  const y2: number = target.y;

  const dx: number = x2 - x1;
  const dy: number = y2 - y1;
  const dr: number = Math.sqrt(dx * dx + dy * dy);

  // Defaults for normal edge.
  const ellipticalArc: number = config.ellipticalArc || 2.5;
  const xAxisRotation: number = config.xAxisRotation || 0;

  let drx: number = dr * ellipticalArc * 2;
  let dry: number = dr * ellipticalArc; // * 2;
  let largeArc = 0; // 1 or 0
  let sweep = 1; // 1 or 0

  let mx2: number = x2;
  let my2: number = y2;

  // Self edge.
  if (dx === 0 && dy === 0 && !config.isTargetMouse) {
    // Fiddle with this angle to get loop oriented.

    // Needs to be 1.
    largeArc = 1;

    // Change sweep to change orientation of loop.
    sweep = 0;

    // Make drx and dry different to get an ellipse
    // instead of a circle.
    drx = 20;
    dry = 10;

    y1 -= 6;

    mx2 = x2 + 1;
    my2 = y2 - r - 4;
  } else if (!config.isTargetMouse) {
    const a: number = Math.atan2(dy, dx);
    const tr: number = r + 6;
    mx2 = x2 - Math.cos(a) * tr;
    my2 = y2 - Math.sin(a) * tr;
  }

  const d: string = `M${x1.toFixed()},${y1.toFixed()}A${drx},${dry} ${xAxisRotation},${largeArc},${sweep} ${mx2.toFixed()},${my2.toFixed()}`;
  return d;
}
