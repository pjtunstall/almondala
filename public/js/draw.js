import init, { calculate_mandelbrot } from "../wasm/almondala.js";
await init();
export default class Renderer {
    imageData;
    constructor(imageData) {
        this.imageData = imageData;
    }
    draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state) {
        const pixels = calculate_mandelbrot(this.imageData.width, this.imageData.height, maxIterations, fullMaxIterations, state.offsetX, state.offsetY, state.zoom, state.ratio, rFactor, gFactor, bFactor);
        if (this.imageData.data.length !== pixels.length) {
            console.error("Lengths out of sync: imageData: ${this.imageData.length}, pixels.length: ${pixels.length}");
            return;
        }
        for (let i = 0; i < pixels.length; i++) {
            this.imageData.data[i] = pixels[i];
        }
        ctx.putImageData(this.imageData, 0, 0);
    }
}
//# sourceMappingURL=draw.js.map