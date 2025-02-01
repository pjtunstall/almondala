import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";

declare const self: Worker;
interface DedicatedWorkerGlobalScope {
  postMessage(message: any, transfer?: Transferable[]): void;
}

init().then(() => {
  self.postMessage({ type: "init" });
  onmessage = function (message) {
    const data = message.data;

    const {
      worker_id,
      render_id,
      tile_width,
      tile_height,
      canvas_width,
      canvas_height,
      maxIterations,
      fullMaxIterations,
      tile_left,
      tile_top,
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
        tile_width,
        tile_height,
        canvas_width,
        canvas_height,
        maxIterations,
        fullMaxIterations,
        tile_left,
        tile_top,
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

    if (pixels.length !== tile_width * tile_height * 4) {
      console.error(
        `Lengths out of sync: pixels.length: ${
          pixels.length
        }, tile_width * tile_height * 4: ${tile_width * tile_height * 4}`
      );
      return;
    }

    const imageData = new ImageData(pixels, tile_width, tile_height);

    createImageBitmap(imageData).then((imageBitmap) => {
      (self as DedicatedWorkerGlobalScope).postMessage(
        {
          type: "render",
          worker_id,
          render_id,
          tile_left,
          tile_top,
          imageBitmap,
        },
        [imageBitmap]
      );
    });

    // const { x, y } = state.mid;
    // console.log(
    //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
    // );
  };
});
