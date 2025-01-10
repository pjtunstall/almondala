const canvas = document.getElementById("mandelbrotCanvas");
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker("worker.js", { type: "module" });

let drawing = false;

let zoom;
let midX;
let midY;
const fullMaxIterations = 1024;
const firstPassMaxIterations = 256;
let maxIterations = fullMaxIterations;
let rFactor = 23.0;
let gFactor = 17.0;
let bFactor = 17.0;
let fullDrawTimeoutId;

const keys = {};
let cooldown = false;
let dragStartX, dragStartY;
let singleClickTimeoutId;

let prev = 0;

main();

async function main() {
  initCanvas();
  await new Promise((resolve) => {
    worker.onmessage = function (e) {
      if (e.data.type === "initialized") {
        resolve();
      }
    };
  });

  reset();

  document.addEventListener("keydown", (event) => handleKeydown(event.key));
  document.addEventListener("keyup", (event) => handleKeyup(event.key));
  document.addEventListener("mousedown", (event) => handleMousedown(event));

  canvas.addEventListener("mouseup", (event) => {
    handleSingleClick(event);
  });
  canvas.addEventListener("dblclick", (event) => {
    handleDoubleClick(event);
  });

  window.addEventListener("resize", reset);

  requestAnimationFrame(handleKeys);
}

async function initCanvas() {
  worker.postMessage(
    {
      type: "init",
      offscreen,
    },
    [offscreen]
  );
}

function reset() {
  if (cooldown) {
    return;
  }
  cooldown = true;
  setTimeout(() => {
    cooldown = false;
  }, 256);

  zoom = 1.5625;
  midX = -0.75;
  midY = 0.0;

  let width = 0.8 * document.body.clientWidth;
  let height = 0.8 * document.body.clientHeight;
  width > height
    ? (width = height * 1.618033988749895) // Golden ratio.
    : (height = width * 0.618033988749895);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  width *= dpr;
  height *= dpr;
  worker.postMessage({ type: "resize", width, height });

  draw();
}

function draw() {
  if (drawing) {
    return;
  }
  drawing = true;

  worker.postMessage({
    type: "draw",
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
    zoom,
    rFactor,
    gFactor,
    bFactor,
  });
}

worker.addEventListener("message", (e) => {
  if (e.data.type === "drawn") {
    drawing = false;
  }
});

function handleKeys(timestamp) {
  requestAnimationFrame(handleKeys);
  // The check for drawing is to ake sure state is not changed while drawing is blocked/in-progress. (draw returns early if drawing is in progress to prevent a build-up of requests.)
  if (drawing || timestamp - prev < 120) {
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
        midX += zoom * 0.4;
        break;
      case "ArrowRight":
        midX -= zoom * 0.4;
        break;
      case "ArrowUp":
        midY += zoom * 0.4;
        break;
      case "ArrowDown":
        midY -= zoom * 0.4;
        break;
      case "x":
        zoom *= 0.9;
        break;
      case "z":
        zoom *= 1 / 0.9;
        break;
      case " ":
        delete keys[key];
        reset();
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
  draw();
}

function handleKeydown(key) {
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

function handleKeyup(key) {
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

function handleClick(event) {
  const canvasRect = canvas.getBoundingClientRect();

  const x = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  const y = (event.clientY - canvasRect.top) * window.devicePixelRatio;

  const [cx, cy] = canvasToMandelCoords(x, y);

  midX -= cx;
  midY -= cy;
}

function handleSingleClick(event) {
  if (handleDrag(event)) {
    return;
  }
  clearTimeout(singleClickTimeoutId);
  singleClickTimeoutId = setTimeout(() => {
    handleClick(event);
    draw();
  }, 200);
}

function handleDoubleClick(event) {
  clearTimeout(singleClickTimeoutId);
  handleClick(event);
  zoom *= 0.64;
  midX += zoom * 0.4;
  draw();
}

function handleMousedown(event) {
  const canvasRect = canvas.getBoundingClientRect();
  dragStartX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  dragStartY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
}

function handleDrag(event) {
  const canvasRect = canvas.getBoundingClientRect();
  const currentX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  const currentY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
  const dragDeltaX = currentX - dragStartX;
  const dragDeltaY = currentY - dragStartY;

  if (dragDeltaX * dragDeltaX + dragDeltaY * dragDeltaY < 5) {
    return false;
  }

  const [dx, dy] = canvasToMandelDelta(dragDeltaX, dragDeltaY);

  midX += dx;
  midY += dy;

  dragStartX = currentX;
  dragStartY = currentY;

  requestAnimationFrame(draw);

  return true;
}

function canvasToMandelCoords(x, y) {
  // View of 3.5 real units by 2.0 imaginary units in the complex plane.
  const cx = zoom * ((3.5 * x) / canvas.width - 1.75); // -1.75 shifts the real range left, so the left edge of the canvas corresponds to -1.75 on the real axis when zoom = 1, which it will whne you zoom ina  couple of times.
  const cy = zoom * ((2.0 * y) / canvas.height - 1.0); // -1.0 shifts the imaginary range up, so he top edge of the canvas corresponds to 1.0i when zoom = 1. The canvas has vertical coordinates increasing as they go down, the opposite of the complex plane, but the Mandelbrot is symmetric about the real axis, so there's no need to flip it.
  return [cx, cy];
}

function canvasToMandelDelta(dx, dy) {
  const [x1, y1] = canvasToMandelCoords(0, 0);
  const [x2, y2] = canvasToMandelCoords(dx, dy);
  return [x2 - x1, y2 - y1];
}
