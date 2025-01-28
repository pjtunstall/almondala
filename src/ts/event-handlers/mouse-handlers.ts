import { CanvasPoint, Point } from "../points.js";
import Renderer from "../draw.js";
import State from ".././state.js";

let dragStartX: number, dragStartY: number;
let singleClickTimeoutId: number;

export function handleMousedown(event: MouseEvent, canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  dragStartX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  dragStartY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
}

export function handleDrag(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  const canvasRect = canvas.getBoundingClientRect();
  const currentX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  const currentY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
  const dragEnd = new CanvasPoint(currentX, currentY, state).toComplexPoint();
  const dragStart = new CanvasPoint(
    dragStartX,
    dragStartY,
    state
  ).toComplexPoint();
  const dragDelta = dragStart.subtract(dragEnd);

  if (Point.dotProduct(dragDelta, dragDelta) === 0) {
    return false;
  }

  state.mid = state.mid.add(dragDelta);

  dragStartX = currentX;
  dragStartY = currentY;

  requestAnimationFrame(() => renderer.draw(state));

  return true;
}

function handleClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  state: State
) {
  const canvasRect = canvas.getBoundingClientRect();
  const x = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  const y = (event.clientY - canvasRect.top) * window.devicePixelRatio;
  const mid = new CanvasPoint(x, y, state).toComplexPoint();
  state.mid = mid;
}

export function handleSingleClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  if (handleDrag(event, canvas, ctx, renderer, state)) {
    return;
  }
  clearTimeout(singleClickTimeoutId);
  singleClickTimeoutId = window.setTimeout(() => {
    handleClick(event, canvas, state);
    requestAnimationFrame(() => renderer.draw(state));
  }, 200);
}

export function handleDoubleClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  clearTimeout(singleClickTimeoutId);
  handleClick(event, canvas, state);
  state.scaleZoomBy(0.64);
  requestAnimationFrame(() => renderer.draw(state));
}
