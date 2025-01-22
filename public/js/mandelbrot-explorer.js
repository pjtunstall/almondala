import { handleKeydown, handleKeyup, handleKeys, } from "./event-handlers/key-handlers.js";
import { handleSingleClick, handleDoubleClick, handleMousedown, } from "./event-handlers/mouse-handlers.js";
import requestReset, { reset } from "./event-handlers/reset.js";
import State from "./state.js";
export default class MandelbrotExplorer {
    state;
    fullMaxIterations = 1024;
    firstPassMaxIterations = 512;
    maxIterations = 1024;
    rFactor = 23;
    gFactor = 17;
    bFactor = 17;
    canvas = document.createElement("canvas");
    ctx = this.canvas.getContext("2d");
    renderer;
    constructor() {
        this.state = new State(false);
        this.renderer = reset(this.canvas, this.ctx, this.state);
        if (!this.renderer) {
            console.error("Renderer initialization failed");
            return;
        }
        this.renderer.draw(this.maxIterations, this.fullMaxIterations, this.rFactor, this.gFactor, this.bFactor, this.ctx, this.state);
        document.body.append(this.canvas);
        document.addEventListener("keydown", (event) => handleKeydown(event.key));
        document.addEventListener("keyup", (event) => handleKeyup(event.key));
        document.addEventListener("mousedown", (event) => handleMousedown(event, this.canvas));
        this.canvas.addEventListener("mouseup", (event) => {
            handleSingleClick(event, this.canvas, this.maxIterations, this.fullMaxIterations, this.rFactor, this.gFactor, this.bFactor, this.ctx, this.renderer, this.state);
        });
        this.canvas.addEventListener("dblclick", (event) => {
            handleDoubleClick(event, this.canvas, this.maxIterations, this.fullMaxIterations, this.rFactor, this.gFactor, this.bFactor, this.ctx, this.renderer, this.state);
        });
        window.addEventListener("resize", async () => {
            requestReset(this.canvas, this.ctx, this.maxIterations, this.fullMaxIterations, this.rFactor, this.gFactor, this.bFactor, this.renderer, this.state);
        });
        requestAnimationFrame((timestamp) => handleKeys(timestamp, this.maxIterations, this.firstPassMaxIterations, this.fullMaxIterations, this.canvas.width, this.canvas.height, this.rFactor, this.gFactor, this.bFactor, this.canvas, this.ctx, this.renderer, this.state));
    }
}
//# sourceMappingURL=mandelbrot-explorer.js.map