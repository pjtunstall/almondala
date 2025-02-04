import MandelbrotExplorer from "./mandelbrot-explorer.js";
import State from "./state.js";
const numWorkers = 2;
const workers = [];
const initResolvers = [];
const initPromises = [];
for (let i = 0; i < numWorkers; i++) {
    workers.push(new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
    }));
    initPromises.push(new Promise((resolve) => {
        initResolvers.push(resolve);
    }));
}
let state = new State(23, initResolvers, workers);
await Promise.all(initPromises);
new MandelbrotExplorer(state);
//# sourceMappingURL=main.js.map