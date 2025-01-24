import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";
import State from "./state.js";

await init();

export default class Renderer {
  imageData: ImageData;
  ctx: CanvasRenderingContext2D;

  constructor(imageData: ImageData, ctx: CanvasRenderingContext2D) {
    this.imageData = imageData;
    this.ctx = ctx;
  }

  draw(maxIterations: number, state: State) {
    const width = this.imageData.width;
    const height = this.imageData.height;

    const pixels = calculate_mandelbrot(
      width,
      height,
      maxIterations,
      state.fullMaxIterations,
      state.mid.x,
      state.mid.y,
      state.zoom,
      state.ratio,
      state.rFactor,
      state.gFactor,
      state.bFactor,
      state.power,
      state.grayscale
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

    this.ctx.putImageData(this.imageData, 0, 0);

    const { x, y } = state.mid;
    console.log(
      `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
    );
  }
}
