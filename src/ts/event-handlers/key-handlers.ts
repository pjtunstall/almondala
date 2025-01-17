import Renderer from "../draw.js";
import requestReset from "./reset.js";
import State from ".././state.js";

let prev = 0;
const keys: { [key: string]: boolean } = {};

export function handleKeys(
  timestamp: number,
  maxIterations: number,
  firstPassMaxIterations: number,
  fullMaxIterations: number,
  width: number,
  height: number,
  rFactor: number,
  gFactor: number,
  bFactor: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  requestAnimationFrame((timestamp) =>
    handleKeys(
      timestamp,
      maxIterations,
      firstPassMaxIterations,
      fullMaxIterations,
      width,
      height,
      rFactor,
      gFactor,
      bFactor,
      canvas,
      ctx,
      renderer,
      state
    )
  );
  if (timestamp - prev < 120) {
    return;
  }
  prev = timestamp;

  if (Object.keys(keys).length === 0) {
    prev = timestamp;
    return;
  }

  Object.keys(keys).forEach((key) => {
    switch (key) {
      case "ArrowLeft":
        state.offsetX += state.zoom * 0.4;
        break;
      case "ArrowRight":
        state.offsetX -= state.zoom * 0.4;
        break;
      case "ArrowUp":
        state.offsetY += state.zoom * 0.4;
        break;
      case "ArrowDown":
        state.offsetY -= state.zoom * 0.4;
        break;
      case "x":
        state.zoom *= 0.8;
        break;
      case "z":
        state.zoom *= 1.25;
        break;
      case " ":
        requestReset(
          canvas,
          ctx,
          maxIterations,
          fullMaxIterations,
          rFactor,
          gFactor,
          bFactor,
          renderer,
          state
        );
        if (keys[key] === false) {
          delete keys[key];
        }
        return;
    }

    if (keys[key] === false) {
      delete keys[key];
    }
  });

  if (Object.keys(keys).length === 0) {
    maxIterations = fullMaxIterations;
  } else {
    maxIterations = firstPassMaxIterations;
  }

  renderer.draw(
    maxIterations,
    fullMaxIterations,
    rFactor,
    gFactor,
    bFactor,
    ctx,
    state
  );
}

export function handleKeydown(key: string) {
  switch (key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "x":
    case "z":
    case " ":
      keys[key] = true;
  }
}

export function handleKeyup(key: string) {
  switch (key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "x":
    case "z":
    case " ":
      keys[key] = false;
  }
}
