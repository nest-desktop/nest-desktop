// connectionGraphPath.ts

import { degToRad } from "@/utils/converter";

/**
 * Calc SVG path to Node.
 */
export function calcPathNode(
  source: { x: number; y: number },
  target: { x: number; y: number },
  options: {
    ellipticalArc?: number;
    largeArc?: number;
    radius?: number;
    sweep?: number;
    xAxisRotation?: number;
  } = {},
): {
  a: number;
  ax: number;
  ay: number;
  dr: number;
  drx: number;
  dry: number;
  largeArc: number;
  sweep: number;
  tr: number;
  x1: number;
  x2: number;
  xAxisRotation: number;
  y2: number;
  y1: number;
} {
  const r: number = options.radius || 24;

  const sr: number = r - 2;
  const tr: number = r + 10;

  // Defaults for normal edge.
  const ellipticalArc: number = options.ellipticalArc || 2.5;
  const xAxisRotation: number = options.xAxisRotation || 0;
  let largeArc = options.largeArc || 0; // 1 or 0
  let sweep = options.sweep || 0; // 1; // 1 or 0

  let x1: number = source.x;
  let y1: number = source.y;

  let x2: number = target.x;
  let y2: number = target.y;

  const dx: number = x2 - x1;
  const dy: number = y2 - y1;
  const dr: number = Math.sqrt(dx * dx + dy * dy);

  let drx: number = dr * ellipticalArc * 2;
  let dry: number = dr * ellipticalArc; // * 2;

  let a = 0;
  let ax = 0;
  let ay = 0;

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

    x2 = x2 + 1;
    y2 = y2 - r - 4;
  } else {
    // a = Math.abs(dx) > Math.abs(dy) ? Math.atan2(0, dx) : Math.atan2(dy, 0);

    a = Math.atan2(dy, dx);

    ax = Math.pow(-1, sweep) * Math.cos(degToRad(xAxisRotation));
    ay = Math.pow(-1, sweep) * Math.sin(degToRad(xAxisRotation));

    x1 = x1 + Math.cos(a + ax / ellipticalArc / 2) * sr;
    y1 = y1 + Math.sin(a + ay / ellipticalArc / 2) * sr;

    x2 = x2 - Math.cos(a - ax / ellipticalArc / 2) * tr;
    y2 = y2 - Math.sin(a - ay / ellipticalArc / 2) * tr;
  }

  return {
    a,
    ax,
    ay,
    dr,
    drx,
    dry,
    largeArc,
    sweep,
    tr,
    x1,
    x2,
    xAxisRotation,
    y2,
    y1,
  };
}

/**
 * Draw SVG path to Node.
 */
export function drawPathNode(
  source: { x: number; y: number },
  target: { x: number; y: number },
  options: {
    ellipticalArc?: number;
    largeArc?: number;
    radius?: number;
    sweep?: number;
    xAxisRotation?: number;
  } = {},
): string {
  const path = calcPathNode(source, target, options);

  return [
    `M${path.x1},${path.y1}A${path.drx},${path.dry}`,
    `${path.xAxisRotation},${path.largeArc},${path.sweep}`,
    `${path.x2},${path.y2}`,
  ].join(" ");
}

/**
 * Draw SVG path to mouse.
 */
export function drawPathMouse(source: { x: number; y: number }, target: { x: number; y: number }): string {
  // Defaults for normal edge.
  const ellipticalArc: number = 2.5;
  const xAxisRotation: number = 0;
  const largeArc = 0; // 1 or 0
  const sweep = 0; // 1; // 1 or 0

  const x1: number = source.x;
  const y1: number = source.y;

  const x2: number = target.x;
  const y2: number = target.y;

  const dx: number = x2 - x1;
  const dy: number = y2 - y1;
  const dr: number = Math.sqrt(dx * dx + dy * dy);

  const drx: number = dr * ellipticalArc * 2;
  const dry: number = dr * ellipticalArc; // * 2;

  return [`M${x1},${y1}A${drx},${dry}`, `${xAxisRotation},${largeArc},${sweep}`, `${x2},${y2}`].join(" ");
}
