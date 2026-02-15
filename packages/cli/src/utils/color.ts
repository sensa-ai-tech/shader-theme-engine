/**
 * Hex color string → [r, g, b] floats in 0-1 range.
 * Accepts "#RRGGBB" or "RRGGBB".
 */
export function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length !== 6) {
    throw new Error(`Invalid hex color: "${hex}". Expected format: #RRGGBB`);
  }
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

/**
 * [r, g, b] floats in 0-1 → "vec3(r, g, b)" GLSL literal.
 */
export function vec3ToGlsl(v: [number, number, number]): string {
  return `vec3(${v[0].toFixed(3)}, ${v[1].toFixed(3)}, ${v[2].toFixed(3)})`;
}

/**
 * Format [r, g, b] as a JSON-compatible array string: "[0.318, 0.0, 1.0]"
 */
export function vec3ToJson(v: [number, number, number]): string {
  return `[${v.map((n) => Number(n.toFixed(3))).join(', ')}]`;
}
