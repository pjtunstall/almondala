import init, { calculate_mandelbrot } from "../wasm/almondala.js";

const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
let imageData;

let zoom;
let fakeScale = 1;
let isZoomingTimer;
let midX;
let midY;
const fullMaxIterations = 1024;
const firstPassMaxIterations = 512;
let maxIterations = fullMaxIterations;
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

  zoom = 1.0;
  midX = 0.6;
  midY = 0.0;

  let width = 0.8 * document.body.clientWidth;
  let height = 0.8 * document.body.clientHeight;
  width > height
    ? (width = height * 1.618033988749895) // Golden ratio.
    : (height = width * 0.618033988749895);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  imageData = ctx.createImageData(canvas.width, canvas.height);

  requestAnimationFrame(draw);
}

function fakeZoom(scaleFactor) {
  fakeScale *= scaleFactor;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(fakeScale, fakeScale);

  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = imageData.width;
  imgCanvas.height = imageData.height;
  const imgCtx = imgCanvas.getContext("2d");
  imgCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(imgCanvas, -imageData.width / 2, -imageData.height / 2);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

let fakePanX = 0;
let fakePanY = 0;

function fakePan(deltaX, deltaY) {
  console.log(`fakePan: ${fakePanX}, ${fakePanY}`);
  fakePanX += deltaX;
  fakePanY += deltaY;
  console.log(`fakePan: ${fakePanX}, ${fakePanY}`);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.log("Before transform reset:", ctx.getTransform());
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  console.log("After transform reset:", ctx.getTransform());

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(fakeScale, fakeScale);
  ctx.translate(fakePanX, fakePanY);

  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = imageData.width;
  imgCanvas.height = imageData.height;
  const imgCtx = imgCanvas.getContext("2d");
  imgCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(imgCanvas, -imageData.width / 2, -imageData.height / 2);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function draw() {
  const pixels = calculate_mandelbrot(
    canvas.width,
    canvas.height,
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
    zoom,
    rFactor,
    gFactor,
    bFactor
  );
  console.log("draw");

  if (imageData.data.length !== pixels.length) {
    return;
  }

  for (let i = 0; i < pixels.length; i++) {
    imageData.data[i] = pixels[i];
  }

  ctx.putImageData(imageData, 0, 0);

  console.log(`midX: ${midX}, midY: ${midY}, zoom: ${zoom}`);
}

let isPanningTimer;

function setZoomTimer() {
  clearTimeout(isZoomingTimer);
  isZoomingTimer = setTimeout(() => {
    fakeScale = 1;
    requestAnimationFrame(draw);
  }, 180);
}

function setPanTimer() {
  clearTimeout(isPanningTimer);
  isPanningTimer = setTimeout(() => {
    fakePanX = 0;
    fakePanY = 0;
    requestAnimationFrame(draw);
  }, 180);
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
        fakePan(40 / fakeScale, 0);
        setPanTimer();
        midX += zoom * 0.4;
        break;
      case "ArrowRight":
        fakePan(-40 / fakeScale, 0);
        setPanTimer();
        midX -= zoom * 0.4;
        break;
      case "ArrowUp":
        fakePan(0, 40 / fakeScale);
        setPanTimer();
        midY += zoom * 0.4;
        break;
      case "ArrowDown":
        fakePan(0, -40 / fakeScale);
        setPanTimer();
        midY -= zoom * 0.4;
        break;
      case "x":
        fakeZoom(1.25);
        setZoomTimer();
        zoom *= 0.8;
        break;
      case "z":
        fakeZoom(0.8);
        setZoomTimer();
        zoom *= 1.25;
        break;
      case " ":
        if (keys[key] === false) {
          delete keys[key];
        }
        reset();
    }

    if (keys[key] === false) {
      delete keys[key];
    }
  });

  if (
    keys["z"] ||
    keys["x"] ||
    keys["ArrowLeft"] ||
    keys["ArrowRight"] ||
    keys["ArrowUp"] ||
    keys["ArrowDown"]
  ) {
    return;
  }

  if (Object.keys(keys).length === 0) {
    maxIterations = fullMaxIterations;
  } else {
    maxIterations = firstPassMaxIterations;
  }

  requestAnimationFrame(draw);
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

  const cx = midX - 1.618033988749895 * (x / canvas.width - 0.5) * 3.0 * zoom;
  const cy = midY - (y / canvas.height - 0.5) * 3.0 * zoom;

  midX = cx;
  midY = cy;
}

function handleSingleClick(event) {
  if (handleDrag(event)) {
    return;
  }

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
  fakeScale = 1;

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

  midX += dx;
  midY += dy;

  dragStartX = currentX;
  dragStartY = currentY;

  requestAnimationFrame(draw);

  return true;
}

function canvasToMandelCoords(x, y) {
  const cx = 1.618033988749895 * (x / canvas.width - 0.5) * 3.0 * zoom;
  const cy = (y / canvas.width - 0.5) * 3.0 * zoom;
  return [cx, cy];
}

function canvasToMandelDelta(dx, dy) {
  const [x1, y1] = canvasToMandelCoords(0, 0);
  const [x2, y2] = canvasToMandelCoords(dx, dy);
  return [x2 - x1, y2 - y1];
}
