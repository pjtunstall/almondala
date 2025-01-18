import {
  canvasToMandelCoords,
  canvasToMandelDelta,
} from "../coordinate-transformations.js";
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
  width: number,
  height: number,
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
  const dragDeltaX = currentX - dragStartX;
  const dragDeltaY = currentY - dragStartY;

  if (dragDeltaX * dragDeltaX + dragDeltaY * dragDeltaY < 5) {
    return false;
  }

  const [dx, dy] = canvasToMandelDelta(
    0,
    0,
    dragDeltaX,
    dragDeltaY,
    width,
    height,
    state
  );

  state.offsetX += dx;
  state.offsetY += dy;

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
  width: number,
  height: number,
  state: State
) {
  const canvasRect = canvas.getBoundingClientRect();

  const x = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  const y = (event.clientY - canvasRect.top) * window.devicePixelRatio;

  const [dx, dy] = canvasToMandelDelta(
    x,
    y,
    width / 2,
    height / 2,
    width,
    height,
    state
  );

  state.offsetX += dx;
  state.offsetY += dy;
}

export function handleSingleClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
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
      width,
      height,
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
    handleClick(event, canvas, width, height, state);
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
  width: number,
  height: number,
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
  handleClick(event, canvas, width, height, state);
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
