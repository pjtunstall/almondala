import State from "./state.js";

export function canvasToMandelCoords(
  x: number,
  y: number,
  width: number,
  height: number,
  state: State
): [number, number] {
  if (width <= 0 || height <= 0) {
    console.error(
      `Error: Height and width should be positive: height: ${height}, width: ${width}`
    );
    return [0, 0];
  }

  const { zoom, offsetX, offsetY, ratio } = state;

  const cx = ratio * (x / width - 0.5) * 3 * zoom - offsetX;
  const cy = offsetY - (y / height - 0.5) * 3 * zoom;
  return [cx, cy];
}

export function canvasToMandelDelta(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  height: number,
  state: State
): [number, number] {
  const [cx1, cy1] = canvasToMandelCoords(x1, y1, width, height, state);
  const [cx2, cy2] = canvasToMandelCoords(x2, y2, width, height, state);
  return [cx2 - cx1, cy2 - cy1];
}
