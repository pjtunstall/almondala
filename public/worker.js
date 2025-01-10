import init, { calculate_mandelbrot } from "./wasm/almondala.js";

let offscreen;
let ctx;
let width;
let height;
let imageData;

onmessage = async function (e) {
  switch (e.data.type) {
    case "init":
      await init();
      offscreen = e.data.offscreen;
      ctx = offscreen.getContext("2d");
      this.self.postMessage({ type: "initialized" });
      break;
    case "resize":
      width = Math.floor(e.data.width);
      height = Math.floor(e.data.height);
      offscreen.width = width;
      offscreen.height = height;
      imageData = ctx.createImageData(offscreen.width, offscreen.height);
      break;
    case "draw":
      const {
        maxIterations,
        fullMaxIterations,
        midX,
        midY,
        zoom,
        rFactor,
        gFactor,
        bFactor,
      } = e.data;
      if (maxIterations === fullMaxIterations) {
        drawFull(
          maxIterations,
          fullMaxIterations,
          midX,
          midY,
          zoom,
          rFactor,
          gFactor,
          bFactor
        );
      } else {
        drawQuick(
          maxIterations,
          fullMaxIterations,
          midX,
          midY,
          zoom,
          rFactor,
          gFactor,
          bFactor
        );
      }
      break;
  }
};

function drawQuick(
  maxIterations,
  fullMaxIterations,
  midX,
  midY,
  zoom,
  rFactor,
  gFactor,
  bFactor
) {
  let pixels = calculate_mandelbrot(
    width,
    height,
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
    zoom,
    rFactor,
    gFactor,
    bFactor,
    0
  );
  if (imageData.data.length !== pixels.length) {
    return;
  }

  for (let i = 0; i < pixels.length / 4; i++) {
    imageData.data[4 * i] = pixels[4 * i];
    imageData.data[4 * i + 1] = pixels[4 * i + 1];
    imageData.data[4 * i + 2] = pixels[4 * i + 2];
    imageData.data[4 * i + 3] = pixels[4 * i + 3];
  }

  pixels = calculate_mandelbrot(
    width,
    height,
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
    zoom,
    rFactor,
    gFactor,
    bFactor,
    1
  );

  for (let i = 0; i < pixels.length / 4; i++) {
    if ((i % width) % 2 === 1) {
      continue;
    }
    imageData.data[4 * i] = pixels[4 * i];
    imageData.data[4 * i + 1] = pixels[4 * i + 1];
    imageData.data[4 * i + 2] = pixels[4 * i + 2];
    imageData.data[4 * i + 3] = pixels[4 * i + 3];
  }

  requestAnimationFrame(() => {
    console.log("drawing now");
    console.log("iterations:", maxIterations);
    console.log("midX", midX);
    console.log("midY", midY);
    ctx.putImageData(imageData, 0, 0);
  });

  self.postMessage({ type: "drawn" });
}

function drawFull(
  maxIterations,
  fullMaxIterations,
  midX,
  midY,
  zoom,
  rFactor,
  gFactor,
  bFactor
) {
  let pixels = calculate_mandelbrot(
    width,
    height,
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
    zoom,
    rFactor,
    gFactor,
    bFactor,
    0
  );
  if (imageData.data.length !== pixels.length) {
    return;
  }

  for (let i = 0; i < pixels.length / 4; i++) {
    imageData.data[4 * i] = pixels[4 * i];
    imageData.data[4 * i + 1] = pixels[4 * i + 1];
    imageData.data[4 * i + 2] = pixels[4 * i + 2];
    imageData.data[4 * i + 3] = pixels[4 * i + 3];
  }

  ctx.putImageData(imageData, 4, 0);
  requestAnimationFrame(() => {
    console.log("drawing now");
    console.log("iterations:", maxIterations);
    console.log("midX", midX);
    console.log("midY", midY);
    ctx.putImageData(imageData, 0, 0);
  });

  console.log("half drawn");

  pixels = calculate_mandelbrot(
    width,
    height,
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
    zoom,
    rFactor,
    gFactor,
    bFactor,
    1
  );

  for (let i = 0; i < pixels.length / 4; i++) {
    if ((i % width) % 2 === 1) {
      continue;
    }
    imageData.data[4 * i] = pixels[4 * i];
    imageData.data[4 * i + 1] = pixels[4 * i + 1];
    imageData.data[4 * i + 2] = pixels[4 * i + 2];
    imageData.data[4 * i + 3] = pixels[4 * i + 3];
  }

  requestAnimationFrame(() => {
    console.log("drawing now");
    console.log("iterations:", maxIterations);
    console.log("midX", midX);
    console.log("midY", midY);
    ctx.putImageData(imageData, 0, 0);
  });

  self.postMessage({ type: "drawn" });
}
