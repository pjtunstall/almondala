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
    const width = this.imageData.width;
    const height = this.imageData.height;

    const pixels = calculate_mandelbrot(
      width,
      height,
      maxIterations,
      fullMaxIterations,
      state.mid.x,
      state.mid.y,
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

    const { x, y } = state.mid;
    console.log(`${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`);
  }
}

// // Uncomment to benchmark. With `rayon`, the avarage duration is 903ms (standard deviation 51ms), without: 585ms (standard deviation 66ms).
// async function benchmarkMandelbrot() {
//   const start = performance.now();

//   calculate_mandelbrot(
//     1.618033988749895 * 600,
//     600,
//     1024,
//     1024,
//     -0.6,
//     0,
//     1.618033988749895,
//     1,
//     23,
//     17,
//     17
//   );

//   const end = performance.now();
//   const duration = end - start;

//   return duration;
// }

// const durations = [];
// for (let i = 0; i < 100; i++) {
//   const duration = await benchmarkMandelbrot();
//   console.log(`${i}. ${duration}ms`);
//   durations.push(duration);
// }

// const averageDuration =
//   durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
// console.log(`${averageDuration}ms (average)`);

// const std = Math.sqrt(
//   durations.reduce(
//     (sum, duration) => sum + Math.pow(duration - averageDuration, 2),
//     0
//   ) / durations.length
// );
// console.log(std);
