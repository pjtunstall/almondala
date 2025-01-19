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
  maxIterations: number,
  fullMaxIterations: number,
  rFactor: number,
  gFactor: number,
  bFactor: number,
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

  console.log(Point.dotProduct(dragDelta, dragDelta));

  if (Point.dotProduct(dragDelta, dragDelta) <= 0) {
    return false;
  }

  state.mid = state.mid.add(dragDelta);

  dragStartX = currentX;
  dragStartY = currentY;

  requestAnimationFrame(() =>
    renderer.draw(
      maxIterations,
      fullMaxIterations,
      rFactor,
      gFactor,
      bFactor,
      ctx,
      state
    )
  );

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
  maxIterations: number,
  fullMaxIterations: number,
  rFactor: number,
  gFactor: number,
  bFactor: number,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  if (
    handleDrag(
      event,
      canvas,
      maxIterations,
      fullMaxIterations,
      rFactor,
      gFactor,
      bFactor,
      ctx,
      renderer,
      state
    )
  ) {
    return;
  }
  clearTimeout(singleClickTimeoutId);
  singleClickTimeoutId = window.setTimeout(() => {
    handleClick(event, canvas, state);
    requestAnimationFrame(() =>
      renderer.draw(
        maxIterations,
        fullMaxIterations,
        rFactor,
        gFactor,
        bFactor,
        ctx,
        state
      )
    );
  }, 200);
}

export function handleDoubleClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  maxIterations: number,
  fullMaxIterations: number,
  rFactor: number,
  gFactor: number,
  bFactor: number,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  clearTimeout(singleClickTimeoutId);
  handleClick(event, canvas, state);
  state.zoom *= 0.64;
  requestAnimationFrame(() =>
    renderer.draw(
      maxIterations,
      fullMaxIterations,
      rFactor,
      gFactor,
      bFactor,
      ctx,
      state
    )
  );
}
