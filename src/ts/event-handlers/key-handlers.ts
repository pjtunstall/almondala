import State from ".././state.js";

let prev = 0;
const keys: { [key: string]: boolean } = {};

export function handleKeys(timestamp: number, state: State) {
  // The reason for using this key-handling mechanism--an asynchronous loop and `keys` object, rather than simply handling keypresses individually as each one occurs--is so that we can detect key chords (multiple simultaneous keypresses). It also allows us to throttle draw requests in one place. An object is used rather than a set because we don't just want to know if a key is currently down (in which case it's value will be `true`), but also whether it's been pressed and released since the previous iteration (in which case it will be `false`).
  requestAnimationFrame((timestamp) => handleKeys(timestamp, state));
  if (timestamp - prev < 16) {
    return;
  }
  prev = timestamp;

  if (Object.keys(keys).length === 0) {
    return;
  }

  let ds = 1;
  let dx = 0;
  let dy = 0;

  Object.keys(keys).forEach((key) => {
    switch (key) {
      case "ArrowLeft":
        dx += 3;
        state.panLeft();
        break;
      case "ArrowRight":
        dx -= 3;
        state.panRight();
        break;
      case "ArrowUp":
        dy == 3;
        state.panUp();
        break;
      case "ArrowDown":
        dy -= 3;
        state.panDown();
        break;
      case "x":
        ds *= 1 / 0.96;
        state.scaleZoomBy(0.96);
        break;
      case "z":
        ds *= 0.96;
        state.scaleZoomBy(1 / 0.96);
        break;
      case " ":
      case "Escape":
        state.requestReset();
        if (keys[key] === false) {
          delete keys[key];
        }
        return;
      default:
        return;
    }

    if (keys[key] === false) {
      delete keys[key];
    }
  });

  // // Uncomment to experiment with zooming and panning with canvas transformations as a placeholder till the calculation is ready. Needs coordinating better.
  // requestAnimationFrame(() => state.fakeRender(ds, dx, dy));
  state.render();
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
    case " ":
    case "Escape":
      keys[key] = false;
  }
}
