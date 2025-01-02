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
  let zoom = 1;
  const maxIterations = 1000;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pixels = calculate_mandelbrot(
      canvas.width,
      canvas.height,
      maxIterations,
      zoom
    );

    for (let i = 0; i < pixels.length; i++) {
      imageData.data[i] = pixels[i];
    }

    ctx.putImageData(imageData, 0, 0);
  };

  draw();

  document.addEventListener("keydown", function (event) {
    if (event.key === "+") {
      zoom *= 0.9;
    } else if (event.key === "-") {
      zoom *= 1.5;
    }

    draw();
  });
}
