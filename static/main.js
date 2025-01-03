import init, { calculate_mandelbrot } from "../pkg/almondala.js";

main();

async function main() {
  await init();

  const canvas = document.getElementById("mandelbrotCanvas");
  const ctx = canvas.getContext("2d");

  const width = 700;
  const height = 400;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  let zoom = 1.0;
  let midX = 2.5;
  let midY = 1.0;
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
    }, 64);

    switch (event.key) {
      case "ArrowLeft":
        midX += 0.1 * zoom;
        break;
      case "ArrowRight":
        midX -= 0.1 * zoom;
        break;
      case "ArrowUp":
        midY += 0.1 * zoom;
        break;
      case "ArrowDown":
        midY -= 0.1 * zoom;
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
