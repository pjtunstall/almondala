import init, { calculate_mandelbrot } from "../pkg/almondala.js";

const keys = {};
let zoom;
let midX;
let midY;
const maxIterations = 1024;
let imageData;
const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");
let cooldown = false;

main();

async function main() {
  await init();

  reset();

  document.addEventListener("keydown", (event) => handleKeydown(event.key));
  document.addEventListener("keyup", (event) => handleKeyup(event.key));
  canvas.addEventListener("click", (event) => {
    clickHandler(event);
    draw();
  });
  canvas.addEventListener("dblclick", (event_) => {
    zoom *= 0.8;
    draw();
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

function handleKeys(timestamp_) {
  requestAnimationFrame(handleKeys);

  if (Object.keys(keys).length === 0) {
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
        zoom *= 0.8;
        break;
      case "z":
        zoom *= 1.25;
        break;
      case " ":
        reset();
    }

    if (keys[key] === false) {
      delete keys[key];
    }
  });

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

function clickHandler(event) {
  const rect = canvas.getBoundingClientRect();

  const x = (event.clientX - rect.left) * window.devicePixelRatio;
  const y = (event.clientY - rect.top) * window.devicePixelRatio;

  const cx = zoom * ((3.5 * x) / canvas.width - 2.5 + 0.75);
  const cy = zoom * ((2.0 * y) / canvas.height - 1.0);

  midX -= cx;
  midY -= cy;
}

// let swipeStartX, swipeStartY;

// canvas.addEventListener("touchstart", (event) => {
//   swipeStartX = event.touches[0].clientX;
//   swipeStartY = event.touches[0].clientY;
// });

// canvas.addEventListener("touchmove", (event) => {
//   const swipeEndX = event.touches[0].clientX;
//   const swipeEndY = event.touches[0].clientY;
//   const swipeDeltaX = swipeEndX - swipeStartX;
//   const swipeDeltaY = swipeEndY - swipeStartY;

//   if (Math.abs(swipeDeltaX) > Math.abs(swipeDeltaY)) {
//     if (swipeDeltaX > 0) {
//       midX -= zoom * 0.4;
//     } else {
//       midX += zoom * 0.4;
//     }
//   } else {
//     if (swipeDeltaY > 0) {
//       midY += zoom * 0.4;
//     } else {
//       midY -= zoom * 0.4;
//     }
//   }

//   draw();
// });
