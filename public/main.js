const fastCanvas = document.getElementById("fastCanvas");
const fastOffscreen = fastCanvas.transferControlToOffscreen();
const fastWorker = new Worker("worker.js", { type: "module" });

const slowCanvas = document.getElementById("slowCanvas");
const slowOffscreen = slowCanvas.transferControlToOffscreen();
const slowWorker = new Worker("worker.js", { type: "module" });

let fastDrawing = false;
let slowDrawing = false;

let zoom;
let midX;
let midY;
const fullMaxIterations = 1024;
const firstPassMaxIterations = 256;
let rFactor = 23.0;
let gFactor = 17.0;
let bFactor = 17.0;

const keys = {};
let cooldown = false;
let dragStartX, dragStartY;
let singleClickTimeoutId;

let prev = 0;

main();

async function main() {
  initializeCanvases();
  await new Promise((resolve) => {
    fastWorker.onmessage = function (event) {
      if (event.data.type === "initialized") {
        resolve();
      }
    };
  });

  await new Promise((resolve) => {
    slowWorker.onmessage = function (event) {
      if (event.data.type === "initialized") {
        resolve();
      }
    };
  });

  reset();

  document.addEventListener("keydown", (event) => handleKeydown(event.key));
  document.addEventListener("keyup", (event) => handleKeyup(event.key));
  document.addEventListener("mousedown", (event) => handleMousedown(event));

  fastCanvas.addEventListener("mouseup", (event) => {
    handleSingleClick(event);
  });
  fastCanvas.addEventListener("dblclick", (event) => {
    handleDoubleClick(event);
  });

  window.addEventListener("resize", reset);

  fastWorker.addEventListener("message", (event) => {
    if (event.data.type === "drawn") {
      fastDrawnHandler();
    }
  });

  slowWorker.addEventListener("message", (event) => {
    if (event.data.type === "drawn") {
      slowDrawnHandler();
    }
  });

  requestAnimationFrame(handleKeys);
}

function initializeCanvases() {
  fastWorker.postMessage(
    {
      type: "init",
      offscreen: fastOffscreen,
    },
    [fastOffscreen]
  );

  slowWorker.postMessage(
    {
      type: "init",
      offscreen: slowOffscreen,
    },
    [slowOffscreen]
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

  resize(fastCanvas, fastWorker, width, height);
  resize(slowCanvas, slowWorker, width, height);

  fastDrawing = false;
  slowDrawing = false;
  draw(fastWorker, firstPassMaxIterations);
  draw(slowWorker, fullMaxIterations);
}

function resize(canvas, worker, width, height) {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  width *= dpr;
  height *= dpr;
  worker.postMessage({ type: "resize", width, height });
}

function draw(worker, maxIterations) {
  if (worker === slowWorker) {
    if (slowDrawing) {
      return;
    }
    slowDrawing = true;
  }

  if (worker === fastWorker) {
    if (fastDrawing) {
      return;
    }
    fastDrawing = true;
  }

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

function fastDrawnHandler() {
  fastDrawing = false;
  fastCanvas.style.opacity = 1;
  slowCanvas.style.opacity = 0;
}

function slowDrawnHandler() {
  slowDrawing = false;
  slowCanvas.style.opacity = 1;
  fastCanvas.style.opacity = 0;
}

function handleKeys(timestamp) {
  requestAnimationFrame(handleKeys);
  // The check for fastDrawing or slowDrawing is to make sure state is not changed while drawing is in progress. In that case, draw returns early to prevent a build-up of requests.
  if (fastDrawing || slowDrawing || timestamp - prev < 120) {
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
        midX += zoom * 0.2;
        break;
      case "ArrowRight":
        midX -= zoom * 0.2;
        break;
      case "ArrowUp":
        midY += zoom * 0.2;
        break;
      case "ArrowDown":
        midY -= zoom * 0.2;
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
    draw(fastWorker, firstPassMaxIterations);
    draw(slowWorker, fullMaxIterations);
  } else {
    draw(fastWorker, firstPassMaxIterations);
  }
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
  const canvasRect = fastCanvas.getBoundingClientRect();

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
    draw(fastWorker, firstPassMaxIterations);
    draw(slowWorker, fullMaxIterations);
  }, 200);
}

function handleDoubleClick(event) {
  clearTimeout(singleClickTimeoutId);
  handleClick(event);
  zoom *= 0.64;
  midX += zoom * 0.4;
  draw(fastWorker, firstPassMaxIterations);
  draw(slowWorker, fullMaxIterations);
}

function handleMousedown(event) {
  const canvasRect = fastCanvas.getBoundingClientRect();
  dragStartX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
  dragStartY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
}

function handleDrag(event) {
  const canvasRect = fastCanvas.getBoundingClientRect();
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

  draw(fastWorker, firstPassMaxIterations);
  draw(slowWorker, fullMaxIterations);

  return true;
}

function canvasToMandelCoords(x, y) {
  // View of 3.5 real units by 2.0 imaginary units in the complex plane.
  const cx = zoom * ((3.5 * x) / fastCanvas.width - 1.75); // -1.75 shifts the real range left, so the left edge of the canvas corresponds to -1.75 on the real axis when zoom = 1, which it will whne you zoom ina  couple of times.
  const cy = zoom * ((2.0 * y) / fastCanvas.height - 1.0); // -1.0 shifts the imaginary range up, so he top edge of the canvas corresponds to 1.0i when zoom = 1. The canvas has vertical coordinates increasing as they go down, the opposite of the complex plane, but the Mandelbrot is symmetric about the real axis, so there's no need to flip it.
  return [cx, cy];
}

function canvasToMandelDelta(dx, dy) {
  const [x1, y1] = canvasToMandelCoords(0, 0);
  const [x2, y2] = canvasToMandelCoords(dx, dy);
  return [x2 - x1, y2 - y1];
}
