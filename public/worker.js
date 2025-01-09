import init, { calculate_mandelbrot } from "./wasm/almondala.js";

let memory;
let sharedArray;
let offscreen;
let ctx;
let width;
let height;
let isWasmInitialized = false;

onmessage = async function (e) {
  switch (e.data.type) {
    case "init":
      memory = e.data.memory;
      await init({ imports: { env: { memory } } });
      isWasmInitialized = true;
      offscreen = e.data.offscreen;
      ctx = offscreen.getContext("2d");
      this.self.postMessage({ type: "initialized" });
      break;
    case "resize":
      width = Math.floor(e.data.width);
      height = Math.floor(e.data.height);
      offscreen.width = width;
      offscreen.height = height;
      sharedArray = new Uint8ClampedArray(memory.buffer, 0, width * height * 4);
      break;
    case "draw":
      console.log("draw message received");
      if (!isWasmInitialized) {
        // Check if WASM is initialized
        console.error("WASM not initialized yet. Cannot draw.");
        return; // Important: Stop execution if not initialized
      }
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
      this.self.postMessage({ type: "drawn" });
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
  console.log(sharedArray.length);
  console.log("sharedArray.buffer.byteLength", sharedArray.buffer.byteLength);
  console.log("byteOffset", sharedArray.byteOffset);
  // console.log(width);
  // console.log(height);
  // console.log(width * height * 4);

  // console.log(
  //   "Total WebAssembly memory size (bytes):",
  //   memory.buffer.byteLength
  // );
  // console.log("Length of sharedArray:", sharedArray.length);

  // console.log("sharedArray.buffer", sharedArray.buffer);

  calculate_mandelbrot(
    sharedArray.byteOffset,
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

  console.log("calculated");

  // console.log(sharedArray);

  let copiedArray = new Uint8ClampedArray(sharedArray);
  // console.log(copiedArray.length);
  let imageData = new ImageData(copiedArray, offscreen.width, offscreen.height);
  ctx.putImageData(imageData, 0, 0);

  console.log("drawn to offscreen");
}
