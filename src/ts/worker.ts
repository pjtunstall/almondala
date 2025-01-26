import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";

declare const self: Worker;
// let offscreen: OffscreenCanvas;
// let ctx: CanvasRenderingContext2D | null = null;
let isInitialized = false;

init().then(() => {
  console.log("wasm initialized");
  self.postMessage({ type: "init" });
  onmessage = function (message) {
    const data = message.data;
    console.log(data);
    console.log(data.state.imageData);
    console.log(data.state.imageData.width);

    console.log(
      "I'm the worker and I am initialized, so I'm going to calculate."
    );

    const maxIterations = data.maxIterations;
    const state = data.state;
    let imageData = state.imageData;
    const { width, height } = imageData;
    const {
      fullMaxIterations,
      mid,
      zoom,
      ratio,
      rFactor,
      gFactor,
      bFactor,
      power,
      grayscale,
    } = state;

    const pixels = calculate_mandelbrot(
      width,
      height,
      maxIterations,
      fullMaxIterations,
      mid.x,
      mid.y,
      zoom,
      ratio,
      rFactor,
      gFactor,
      bFactor,
      power,
      grayscale
    );

    console.log("I believed I've calculated, pixels:", pixels);

    const clampedPixels = new Uint8ClampedArray(pixels.buffer);
    const newImageData = new ImageData(clampedPixels, width, height);

    createImageBitmap(newImageData).then((imageBitmap) => {
      postMessage({ type: "render", width, height, newImageData }, [
        newImageData.data.buffer,
      ]);
    });

    // if (imageData.data.length !== pixels.length) {
    //   console.error(
    //     "Lengths out of sync: imageData: ${this.imageData.length}, pixels.length: ${pixels.length}"
    //   );
    //   return;
    // }

    // for (let i = 0; i < pixels.length; i++) {
    //   imageData.data[i] = pixels[i];
    // }

    // // ctx.putImageData(imageData, 0, 0);

    // const { x, y } = state.mid;
    // console.log(
    //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
    // );

    // // const bitmap = offscreen.transferToImageBitmap();
    // self.postMessage({ type: "rendered", pixels }, [pixels.buffer]);
  };
});
