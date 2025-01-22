import init, { calculate_mandelbrot } from "../wasm/almondala.js";
await init();
export default class Renderer {
    imageData;
    constructor(imageData) {
        this.imageData = imageData;
    }
    draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state) {
        const width = this.imageData.width;
        const height = this.imageData.height;
        const pixels = calculate_mandelbrot(width, height, maxIterations, fullMaxIterations, state.mid.x, state.mid.y, state.zoom, state.ratio, rFactor, gFactor, bFactor, state.power, state.grayscale);
        if (this.imageData.data.length !== pixels.length) {
            console.error("Lengths out of sync: imageData: ${this.imageData.length}, pixels.length: ${pixels.length}");
            return;
        }
        for (let i = 0; i < pixels.length; i++) {
            this.imageData.data[i] = pixels[i];
        }
        ctx.putImageData(this.imageData, 0, 0);
        const { x, y } = state.mid;
        console.log(`zoom: ${state.zoom}, center: ${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`);
    }
}
//# sourceMappingURL=draw.js.map