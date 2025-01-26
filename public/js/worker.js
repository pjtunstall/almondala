import init, { calculate_mandelbrot } from "../../public/wasm/almondala.js";
// let offscreen: OffscreenCanvas;
// let ctx: CanvasRenderingContext2D | null = null;
let isInitialized = false;
init().then(() => {
    console.log("wasm initialized");
    self.postMessage({ type: "init" });
    onmessage = function (message) {
        const data = message.data;
        console.log(data);
        console.log(data.state.imageData);
        console.log(data.state.imageData.width);
        console.log("I'm the worker and I am initialized, so I'm going to calculate.");
        const maxIterations = data.maxIterations;
        const state = data.state;
        let imageData = state.imageData;
        const { width, height } = imageData;
        const { fullMaxIterations, mid, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale, } = state;
        const pixels = new Uint8ClampedArray(calculate_mandelbrot(width, height, maxIterations, fullMaxIterations, mid.x, mid.y, zoom, ratio, rFactor, gFactor, bFactor, power, grayscale));
        console.log("I believed I've calculated, pixels:", pixels);
        if (pixels.length !== width * height * 4) {
            console.error("Lengths out of sync: pixels.length: ${pixels.length}, widtgh * height * 4: ${width * height * 4}");
            return;
        }
        const newImageData = new ImageData(pixels, width, height);
        createImageBitmap(newImageData).then((imageBitmap) => {
            postMessage({ type: "render", width, height, newImageData }, [
                newImageData.data.buffer,
            ]);
        });
        // for (let i = 0; i < pixels.length; i++) {
        //   imageData.data[i] = pixels[i];
        // }
        // // ctx.putImageData(imageData, 0, 0);
        // const { x, y } = state.mid;
        // console.log(
        //   `zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`
        // );
        // // const bitmap = offscreen.transferToImageBitmap();
        // self.postMessage({ type: "rendered", pixels }, [pixels.buffer]);
    };
});
//# sourceMappingURL=worker.js.map