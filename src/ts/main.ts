import MandelbrotExplorer from "./mandelbrot-explorer.js";
import State from "./state.js";

const initResolvers: ((value: unknown) => void)[] = [];

const initPromise1 = new Promise((resolve) => {
  initResolvers.push(resolve);
});
const initPromise2 = new Promise((resolve) => {
  initResolvers.push(resolve);
});

const promises = [initPromise1, initPromise2];

let state = new State(23, initResolvers);

await Promise.all(promises);

new MandelbrotExplorer(state);
