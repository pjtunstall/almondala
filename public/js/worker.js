import init, { calculate_mandelbrot } from "../wasm/almondala.js";
init().then(() => {
    console.log("wasm initialized");
    self.postMessage({ type: "init" });
    onmessage = function (message) {
        const data = message.data;
        console.log("I'm the worker and I am initialized, so I'm going to calculate.");
        const maxIterations = data.maxIterations;
        const state = data.state;
        const { width, height, fullMaxIterations, mid, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale, } = state;
        const pixels = new Uint8ClampedArray(calculate_mandelbrot(width, height, maxIterations, fullMaxIterations, mid.x, mid.y, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale));
        console.log("I believed I've calculated, pixels:", pixels);
        if (pixels.length !== width * height * 4) {
            console.error(`Lengths out of sync: pixels.length: ${pixels.length}, width * height * 4: ${width * height * 4}`);
            return;
        }
        const imageData = new ImageData(pixels, width, height);
        createImageBitmap(imageData).then((imageBitmap) => {
            self.postMessage({ type: "render", imageBitmap }, [imageBitmap]);
        });
        // const { x, y } = state.mid;
        // console.log(
        //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
        // );
    };
});
//# sourceMappingURL=worker.js.map