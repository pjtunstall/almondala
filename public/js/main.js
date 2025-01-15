import init, { calculate_mandelbrot } from "../wasm/almondala.js";

const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
let imageData;

// Golden ratio, for the canvas.
const Phi = 1.618033988749895;
const phi = 0.618033988749895;

let zoom;
let offsetX;
let offsetY;
const fullMaxIterations = 1024;
let maxIterations = fullMaxIterations;
let rFactor = 23;
let gFactor = 17;
let bFactor = 17;

let zoomingOutTimer;
let zoomingInTimer;
let panningLeftTimer;
let panningRightTimer;
let panningUpTimer;
let panningDownTimer;
const timers = {
  zoomingInTimer,
  zoomingOutTimer,
  panningDownTimer,
  panningLeftTimer,
  panningRightTimer,
  panningUpTimer,
};

const keys = {};
let cooldown = false;
let dragStartX, dragStartY;
let singleClickTimeoutId;

let prev = 0;

main();

async function main() {
  await init();

  reset();
  canvas.style.opacity = 1;

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

function reset() {
  if (cooldown) {
    return;
  }
  cooldown = true;
  setTimeout(() => {
    cooldown = false;
  }, 180);

  zoom = 1;
  offsetX = 0.6;
  offsetY = 0;

  let width = 0.8 * document.body.clientWidth;
  let height = 0.8 * document.body.clientHeight;
  width > height ? (width = height * Phi) : (height = width * phi);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  imageData = ctx.createImageData(canvas.width, canvas.height);

  requestAnimationFrame(draw);
}

function fakeZoom(s) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(s, s);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = imageData.width;
  imgCanvas.height = imageData.height;
  const imgCtx = imgCanvas.getContext("2d");
  imgCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(imgCanvas, 0, 0);
}

function fakePan(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(x, y);

  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = imageData.width;
  imgCanvas.height = imageData.height;
  const imgCtx = imgCanvas.getContext("2d");
  imgCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(imgCanvas, 0, 0);
}

function draw() {
  const pixels = calculate_mandelbrot(
    canvas.width,
    canvas.height,
    maxIterations,
    fullMaxIterations,
    offsetX,
    offsetY,
    zoom,
    rFactor,
    gFactor,
    bFactor
  );

  if (imageData.data.length !== pixels.length) {
    return;
  }

  for (let i = 0; i < pixels.length; i++) {
    imageData.data[i] = pixels[i];
  }

  ctx.putImageData(imageData, 0, 0);
}

function setFakingTimer(timer) {
  Object.entries(timers).forEach(([key, _]) => {
    clearTimeout(timers[key]);
    if (key === timer) {
      timers[key] = setTimeout(() => {
        ctx.resetTransform();
        requestAnimationFrame(draw);
      }, 180);
    }
  });
}

function handleKeys(timestamp) {
  requestAnimationFrame(handleKeys);
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
        fakePan(30, 0);
        setFakingTimer("panningLeftTimer");
        offsetX += canvasToMandelDelta(30, 0)[0];
        break;
      case "ArrowRight":
        fakePan(-30, 0);
        setFakingTimer("panningRightTimer");
        offsetX -= canvasToMandelDelta(30, 0)[0];
        break;
      case "ArrowUp":
        fakePan(0, 30);
        setFakingTimer("panningUpTimer");
        offsetY += canvasToMandelDelta(0, 30)[1];
        break;
      case "ArrowDown":
        fakePan(0, -30);
        setFakingTimer("panningDownTimer");
        offsetY -= canvasToMandelDelta(0, 30)[1];
        break;
      case "x":
        fakeZoom(1 / 0.9);
        setFakingTimer("zoomingInTimer");
        zoom *= 0.9;
        break;
      case "z":
        fakeZoom(0.9);
        setFakingTimer("zoomingOutTimer");
        zoom *= 1 / 0.9;
        break;
      case " ":
        if (keys[key] === false) {
          delete keys[key];
        }
        reset();
    }

    console.log(
      `${offsetX === 0 ? "0" : -offsetX} ${offsetY === 0 ? "+ 0" : -offsetY}i`
    );

    if (keys[key] === false) {
      delete keys[key];
    }
  });
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

  offsetX = cx;
  offsetY = cy;
}

function handleSingleClick(event) {
  if (handleDrag(event)) {
    return;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  Object.entries(timers).forEach(([key, _]) => {
    clearTimeout(timers[key]);
  });

  clearTimeout(singleClickTimeoutId);
  singleClickTimeoutId = setTimeout(() => {
    handleClick(event);
    requestAnimationFrame(draw);
  }, 180);
}

function handleDoubleClick(event) {
  clearTimeout(singleClickTimeoutId);

  handleClick(event);
  zoom *= 0.64;

  fakeZoom(1.5625);

  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 32);
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

  offsetX -= dx;
  offsetY -= dy;

  dragStartX = currentX;
  dragStartY = currentY;

  requestAnimationFrame(draw);

  return true;
}

function canvasToMandelCoords(x, y) {
  const cx = Phi * (x / canvas.width - 0.5) * 3 * zoom - offsetX;
  const cy = (y / canvas.height - 0.5) * 3 * zoom - offsetY;

  return [cx, cy];
}

function canvasToMandelDelta(dx, dy) {
  const [x1, y1] = canvasToMandelCoords(0, 0);
  const [x2, y2] = canvasToMandelCoords(dx, dy);
  return [x2 - x1, y2 - y1];
}
