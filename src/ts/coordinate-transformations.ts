export function canvasToMandelCoords(
  x: number,
  y: number,
  zoom: number,
  width: number,
  height: number
): [number, number] {
  if (width <= 0 || height <= 0) {
    console.error(
      `Error: Height and width should be positive: height: ${height}, width: ${width}`
    );
    return [0, 0];
  }

  // View of 3.5 real units by 2.0 imaginary units in the complex plane.
  const cx = zoom * ((3.5 * x) / width - 1.75);
  const cy = zoom * ((2.0 * y) / height - 1.0);
  return [cx, cy];
}

export function canvasToMandelDelta(
  dx: number,
  dy: number,
  zoom: number,
  width: number,
  height: number
): [number, number] {
  const [x1, y1] = canvasToMandelCoords(0, 0, zoom, width, height);
  const [x2, y2] = canvasToMandelCoords(dx, dy, zoom, width, height);
  return [x2 - x1, y2 - y1];
}
