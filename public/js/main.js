import MandelbrotExplorer from "./mandelbrot-explorer.js";
import State from "./state.js";
import WorkerPool from "./worker-pool.js";
const numWorkers = 2;
const workerPool = new WorkerPool(numWorkers);
await Promise.all(workerPool.initPromises);
let state = new State(23, workerPool);
new MandelbrotExplorer(state);
//# sourceMappingURL=main.js.map