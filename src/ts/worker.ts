import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";

declare const self: Worker;
interface DedicatedWorkerGlobalScope {
  postMessage(message: any, transfer?: Transferable[]): void;
}

init().then(() => {
  console.log("Wasm initialized");
  self.postMessage({ type: "init" });
  onmessage = function (message) {
    const data = message.data;

    // console.log(
    //   "I'm the worker and I am initialized, so I'm going to calculate."
    // );

    const {
      width,
      height,
      maxIterations,
      fullMaxIterations,
      mid,
      zoom,
      ratio,
      rFactor,
      gFactor,
      bFactor,
      power,
      grayscale,
    } = data;

    const pixels = new Uint8ClampedArray(
      calculate_mandelbrot(
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
      )
    );

    // console.log("I believed I've calculated, pixels:", pixels);

    if (pixels.length !== width * height * 4) {
      console.error(
        `Lengths out of sync: pixels.length: ${
          pixels.length
        }, width * height * 4: ${width * height * 4}`
      );
      return;
    }

    const imageData = new ImageData(pixels, width, height);

    createImageBitmap(imageData).then((imageBitmap) => {
      (self as DedicatedWorkerGlobalScope).postMessage(
        { type: "render", imageBitmap },
        [imageBitmap]
      );
    });

    // const { x, y } = state.mid;
    // console.log(
    //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
    // );
  };
});
