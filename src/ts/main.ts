import MandelbrotExplorer from "./mandelbrot-explorer.js";
import State from "./state.js";
import WorkerPool from "./worker-pool.js";

const numWorkers = 2;
const workerPool = new WorkerPool(numWorkers);
let state = new State(23, workerPool);

await Promise.all(workerPool.initPromises);

new MandelbrotExplorer(state);
