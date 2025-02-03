import MandelbrotExplorer from "./mandelbrot-explorer.js";
import State from "./state.js";
console.log("In main, before await.");
const initResolvers = [];
const initPromise1 = new Promise((resolve) => {
    console.log(resolve);
    initResolvers.push(resolve);
});
const initPromise2 = new Promise((resolve) => {
    console.log(resolve);
    initResolvers.push(resolve);
});
const promises = [initPromise1, initPromise2];
console.log(initResolvers);
let state = new State(23, initResolvers);
await Promise.all(promises);
console.log("In main, after await.");
new MandelbrotExplorer(state);
//# sourceMappingURL=main.js.map