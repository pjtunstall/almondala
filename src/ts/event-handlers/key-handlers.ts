import Renderer from "../draw.js";
import requestReset from "./reset.js";
import State from ".././state.js";

let prev = 0;
const keys: { [key: string]: boolean } = {};

export function handleKeys(
  timestamp: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  renderer: Renderer,
  state: State
) {
  // The reason for using this key-handling mechanism--an asynchronous loop and `keys` object, rather than simply handling keypresses individually as each one occurs--is so that we can detect key chords (multiple simultaneous keypresses). It also allows us to throttle draw requests in one place. An object is used rather than a set because we don't just want to know if a key is currently down (in which case it's value will be `true`), but also whether it's been pressed and released since the previous iteration (in which case it will be `false`).
  requestAnimationFrame((timestamp) =>
    handleKeys(timestamp, canvas, ctx, renderer, state)
  );
  if (timestamp - prev < 16) {
    return;
  }
  prev = timestamp;

  if (Object.keys(keys).length === 0) {
    return;
  }

  // Only toggle grayscale when the "g" key has been released.
  if (keys["g"] === false) {
    state.changeColor();
    delete keys["g"];
  }

  Object.keys(keys).forEach((key) => {
    switch (key) {
      case "ArrowLeft":
        state.panLeft();
        break;
      case "ArrowRight":
        state.panRight();
        break;
      case "ArrowUp":
        state.panUp();
        break;
      case "ArrowDown":
        state.panDown();
        break;
      case "x":
        state.scaleZoomBy(0.9);
        break;
      case "z":
        state.scaleZoomBy(1 / 0.9);
        break;
      case " ":
      case "Escape":
        requestReset(canvas, ctx, renderer, state);
        if (keys[key] === false) {
          delete keys[key];
        }
        return;
      default: // E.g. if `keys["g"] === true`, indicating that the key is still being held.
        return;
    }

    if (keys[key] === false) {
      delete keys[key];
    }
  });

  renderer.draw(state);
}

export function handleKeydown(key: string) {
  switch (key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "x":
    case "z":
    case "g":
    case " ":
    case "Escape":
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
    case "g":
    case " ":
    case "Escape":
      keys[key] = false;
  }
}
