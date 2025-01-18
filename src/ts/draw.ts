import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";
import State from "./state.js";

await init();

export default class Renderer {
  imageData: ImageData;

  constructor(imageData: ImageData) {
    this.imageData = imageData;
  }

  draw(
    maxIterations: number,
    fullMaxIterations: number,
    rFactor: number,
    gFactor: number,
    bFactor: number,
    ctx: CanvasRenderingContext2D,
    state: State
  ) {
    const pixels = calculate_mandelbrot(
      this.imageData.width,
      this.imageData.height,
      maxIterations,
      fullMaxIterations,
      state.offsetX,
      state.offsetY,
      state.zoom,
      state.ratio,
      rFactor,
      gFactor,
      bFactor
    );

    if (this.imageData.data.length !== pixels.length) {
      console.error(
        "Lengths out of sync: imageData: ${this.imageData.length}, pixels.length: ${pixels.length}"
      );
      return;
    }

    for (let i = 0; i < pixels.length; i++) {
      this.imageData.data[i] = pixels[i];
    }

    ctx.putImageData(this.imageData, 0, 0);
  }
}
