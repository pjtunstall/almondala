import init, { calculate_mandelbrot } from "../wasm/almondala.js";
init().then(() => {
    self.postMessage({ type: "init" });
    onmessage = function (message) {
        const data = message.data;
        const { id, width, height, maxIterations, fullMaxIterations, x, y, mid, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale, } = data;
        const pixels = new Uint8ClampedArray(calculate_mandelbrot(width, height, maxIterations, fullMaxIterations, mid.x, mid.y, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale));
        if (pixels.length !== width * height * 4) {
            console.error(`Lengths out of sync: pixels.length: ${pixels.length}, width * height * 4: ${width * height * 4}`);
            return;
        }
        const imageData = new ImageData(pixels, width, height);
        createImageBitmap(imageData).then((imageBitmap) => {
            self.postMessage({ type: "render", id, x, y, imageBitmap }, [imageBitmap]);
        });
        // const { x, y } = state.mid;
        // console.log(
        //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
        // );
    };
});
//# sourceMappingURL=worker.js.map