import init, { calculate_mandelbrot } from "../wasm/almondala.js";
init().then(() => {
    self.postMessage({ type: "init" });
    onmessage = function (message) {
        const data = message.data;
        console.log(data);
        const { tileWidth, tileHeight, canvasWidth, canvasHeight, maxIterations, fullMaxIterations, tileLeft, tileTop, mid, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale, } = data;
        const pixels = new Uint8ClampedArray(calculate_mandelbrot(tileWidth, tileHeight, canvasWidth, canvasHeight, maxIterations, fullMaxIterations, tileLeft, tileTop, mid.x, mid.y, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale));
        if (pixels.length !== tileWidth * tileHeight * 4) {
            console.error(`Lengths out of sync: pixels.length: ${pixels.length}, tile_width * tile_height * 4: ${tileWidth * tileHeight * 4}`);
            return;
        }
        const imageData = new ImageData(pixels, tileWidth, tileHeight);
        createImageBitmap(imageData).then((imageBitmap) => {
            self.postMessage({
                type: "render",
                tileLeft,
                tileTop,
                imageBitmap,
            }, [imageBitmap]);
        });
        // const { x, y } = state.mid;
        // console.log(
        //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
        // );
    };
});
//# sourceMappingURL=worker.js.map