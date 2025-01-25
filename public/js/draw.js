import WorkerPool from "./worker-pool.js";
import Tile from "./tile.js";
const ROWS = 12;
const COLS = 8;
let pendingRender = false;
let wantsRender = false;
export default class Renderer {
    imageData;
    canvas;
    ctx;
    tiles;
    workerPool = new WorkerPool(navigator.hardwareConcurrency || 2, "./worker.js");
    constructor(imageData, canvas, ctx) {
        this.imageData = imageData;
        this.canvas = canvas;
        this.ctx = ctx;
        const { width, height } = this.imageData;
        this.tiles = [...Tile.tiles(width, height, ROWS, COLS)];
        console.log("tile length", this.tiles.length);
        console.log(this.tiles);
    }
    draw(maxIterations, state) {
        if (pendingRender) {
            wantsRender = true;
            return;
        }
        pendingRender = true;
        const promises = this.tiles.map((tile) => this.workerPool.addWork(tile, tile.row, state, maxIterations));
        promises.forEach((promise) => {
            promise
                .then((r) => {
                console.log(r);
                try {
                    const tileImageData = new ImageData(r.pixels, r.width, r.height);
                    this.ctx.putImageData(tileImageData, r.left, r.top);
                    console.log("I think I've drawn it.");
                }
                catch (err) {
                    throw err;
                }
            })
                .catch((err) => {
                console.error("Error processing tile:", err);
            });
        });
        pendingRender = true;
        Promise.all(promises)
            .then((results) => console.log("I think I've drawn all the tiles:", results))
            .catch((reason) => {
            console.error("Promise rejected in draw():", reason);
        })
            .finally(() => {
            pendingRender = false;
            if (wantsRender) {
                wantsRender = false;
                this.draw(maxIterations, state);
            }
        });
    }
}
//   const pixels = calculate_mandelbrot(
//     width,
//     height,
//     maxIterations,
//     fullMaxIterations,
//     x,
//     y,
//     zoom,
//     ratio,
//     rFactor,
//     gFactor,
//     bFactor,
//     power,
//     grayscale
//   );
//   if (this.imageData.data.length !== pixels.length) {
//     console.error(
//       "Lengths out of sync: imageData: ${this.imageData.length}, pixels.length: ${pixels.length}"
//     );
//     return;
//   }
//   for (let i = 0; i < pixels.length; i++) {
//     this.imageData.data[i] = pixels[i];
//   }
//   this.ctx.putImageData(this.imageData, 0, 0);
//   console.log(
//     `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
//   );
// }
// }
//# sourceMappingURL=draw.js.map