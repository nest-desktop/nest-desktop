// connectionGraphPath.ts

import { degToRad } from "../converter";

/**
 * Draw SVG path.
 */
export default function drawPath(
  source: { x: number; y: number },
  target: { x: number; y: number },
  options: {
    ellipticalArc?: number;
    isTargetMouse?: boolean;
    largeArc?: number;
    radius?: number;
    sweep?: number;
    xAxisRotation?: number;
  } = {}
): string {
  const r: number = options.radius || 24;

  // Defaults for normal edge.
  const ellipticalArc: number = options.ellipticalArc || 2.5;
  const xAxisRotation: number = options.xAxisRotation || 0;
  let largeArc = options.largeArc || 0; // 1 or 0
  let sweep = options.sweep || 0; // 1; // 1 or 0

  const x1: number = source.x;
  let y1: number = source.y;

  const x2: number = target.x;
  const y2: number = target.y;

  const dx: number = x2 - x1;
  const dy: number = y2 - y1;
  const dr: number = Math.sqrt(dx * dx + dy * dy);

  let drx: number = dr * ellipticalArc * 2;
  let dry: number = dr * ellipticalArc; // * 2;

  let mx2: number = x2;
  let my2: number = y2;

  if (!options.isTargetMouse) {
    // Self edge.
    if (dx === 0 && dy === 0) {
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
    } else {
      const a: number = Math.atan2(dy, dx);
      const tr: number = r + 6;
      mx2 =
        x2 -
        Math.cos(
          a -
            (Math.pow(-1, sweep) * Math.cos(degToRad(xAxisRotation / 4))) /
              ellipticalArc
        ) *
          tr;
      my2 =
        y2 -
        Math.sin(
          a -
            (Math.pow(-1, sweep) * Math.sin(degToRad(xAxisRotation / 4))) /
              ellipticalArc
        ) *
          tr;
    }
  }

  const d: string =
    `M${x1.toFixed()},${y1.toFixed()}` +
    `A${drx},${dry} ` +
    `${xAxisRotation},${largeArc},${sweep} ` +
    `${mx2.toFixed()},${my2.toFixed()}`;
  return d;
}
