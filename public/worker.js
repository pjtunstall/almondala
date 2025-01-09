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
      draw(
        maxIterations,
        fullMaxIterations,
        midX,
        midY,
        zoom,
        rFactor,
        gFactor,
        bFactor
      );
      break;
  }
};

function draw(
  maxIterations,
  fullMaxIterations,
  midX,
  midY,
  zoom,
  rFactor,
  gFactor,
  bFactor
) {
  const pixels = calculate_mandelbrot(
    width,
    height,
    maxIterations,
    fullMaxIterations,
    midX,
    midY,
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

  requestAnimationFrame(() => {
    console.log("drawing now");
    console.log("iterations:", maxIterations);
    console.log("midX", midX);
    console.log("midY", midY);
    ctx.putImageData(imageData, 0, 0);
  });

  self.postMessage({ type: "drawn" });
}
