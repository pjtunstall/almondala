import init, { calculate_mandelbrot } from "../pkg/almondala.js";

main();

async function main() {
  await init();

  run();

  window.addEventListener("resize", run);
}

function run() {
  const canvas = document.getElementById("mandelbrotCanvas");
  const ctx = canvas.getContext("2d");

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  let zoom = 1.5625;
  let midX = -0.75;
  let midY = 0.0;
  const maxIterations = 1000;

  const draw = () => {
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
  };

  draw();

  let inCooldown = false;
  document.addEventListener("keydown", function (event) {
    if (inCooldown) {
      return;
    }

    inCooldown = true;
    setTimeout(() => {
      inCooldown = false;
    }, 256);

    switch (event.key) {
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
    }

    draw();
  });
}
