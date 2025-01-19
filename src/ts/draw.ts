import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";
import State from "./state.js";
import { CanvasPoint, ComplexPoint } from "./points.js";

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
    const width = this.imageData.width;
    const height = this.imageData.height;

    const pixels = calculate_mandelbrot(
      width,
      height,
      maxIterations,
      fullMaxIterations,
      state.midX,
      state.midY,
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

    const canvasCenter = new CanvasPoint(
      this.imageData.width / 2,
      this.imageData.height / 2,
      state
    );
    const complexcenter = canvasCenter.toComplexPoint();
    console.log(
      `${complexcenter.x} ${complexcenter.y < 0 ? "-" : "+"} ${Math.abs(
        complexcenter.y
      )}i`
    );
  }
}
