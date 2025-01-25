import init, { calculate_mandelbrot } from "../wasm/almondala.js";
await init();
self.postMessage({ init: true });
onmessage = function (message) {
    console.log("Message received in worker.");
    console.log("Message data:", message.data);
    const { tile, state, maxIterations } = message.data;
    const { zoom, rFactor, bFactor, gFactor, power, grayscale } = state;
    const { top, left, width, height } = tile;
    const x = tile.left + tile.width / 2;
    const y = tile.top + tile.height / 2;
    const ratio = width / height;
    const pixels = new Uint8ClampedArray(calculate_mandelbrot(width, height, maxIterations, state.fullMaxIterations, x, y, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale));
    console.log("pixels:", pixels);
    self.postMessage({ pixels, top, left, width, height }, [pixels.buffer]);
};
//# sourceMappingURL=worker.js.map