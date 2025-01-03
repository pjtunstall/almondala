import init, { calculate_mandelbrot } from "../pkg/almondala.js";

const keys = new Set();
let isInCooldown = false;
let zoom;
let midX;
let midY;
const maxIterations = 1024;
let imageData;
const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");

main();

async function main() {
  await init();

  reset();

  document.addEventListener("keydown", (event) => handleKeydown(event.key));
  document.addEventListener("keyup", (event) => handleKeyup(event.key));
  window.addEventListener("resize", reset);

  setInterval(handleKeys, 256);
}

function reset() {
  zoom = 1.5625;
  midX = -0.75;
  midY = 0.0;

  let width = 0.8 * document.body.clientWidth;
  let height = 0.8 * document.body.clientHeight;
  width > height
    ? (width = height * 1.618033988749895)
    : (height = width * 0.618033988749895);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  imageData = ctx.createImageData(canvas.width, canvas.height);

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pixels = calculate_mandelbrot(
    canvas.width,
    canvas.height,
    maxIterations,
    midX,
    midY,
    zoom
  );

  for (let i = 0; i < pixels.length; i++) {
    imageData.data[i] = pixels[i];
  }

  ctx.putImageData(imageData, 0, 0);
}

function handleKeys() {
  if (isInCooldown) {
    return;
  }

  isInCooldown = true;
  setTimeout(() => {
    isInCooldown = false;
  }, 256);

  for (const key of keys) {
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
        zoom *= 0.8;
        break;
      case "z":
        zoom *= 1.25;
        break;
      case " ":
        reset();
    }
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
      keys.add(key);
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
      keys.delete(key);
  }
}
