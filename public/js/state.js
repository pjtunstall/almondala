import { ComplexPoint } from "./points.js";
const panDelta = 0.1;
let cooldownTimer = null;
let isWorkerInitialized = false;
let isRenderInProgress = false;
let attempts = 0;
export const worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
});
export const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
window.onload = function () {
    canvas.classList.add("visible");
};
export default class State {
    zoom = 1;
    mid = new ComplexPoint(-0.6, 0);
    width = 0;
    height = 0;
    ratio = 1.618033988749895;
    power = 2;
    grayscale;
    initialGrayscale = 23;
    maxIterations = 128;
    fullMaxIterations = 1024;
    rFactor = 1;
    gFactor = 1;
    bFactor = 1;
    canvas = canvas;
    ctx = ctx;
    constructor(grayscale) {
        this.grayscale = grayscale;
    }
    changeColor() {
        this.grayscale = this.grayscale === 0 ? this.initialGrayscale : 0;
    }
    panLeft() {
        this.mid.x -= this.zoom * panDelta;
    }
    panRight() {
        this.mid.x += this.zoom * panDelta;
    }
    panUp() {
        this.mid.y += this.zoom * panDelta;
    }
    panDown() {
        this.mid.y -= this.zoom * panDelta;
    }
    scaleZoomBy(factor) {
        // // Zooming in further reaches the limits of floating point precision. But preventing it could give the impression that the controls are just not responding, unless some warning is given.
        // if (factor <= 1 && this.zoom < 2e-13) {
        //   return;
        // }
        this.zoom *= factor;
    }
    incrementPowerBy(increment) {
        this.power += increment;
        this.resetView();
    }
    resetView() {
        this.zoom = 1;
        this.mid.x = this.power === 2 ? -0.6 : 0;
        this.mid.y = 0;
    }
    requestReset() {
        if (cooldownTimer)
            clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => {
            Object.assign(this, {
                ...new State(this.grayscale),
                canvas: this.canvas,
                ctx: this.ctx,
            });
            this.canvas.style.transition = "none";
            this.canvas.style.opacity = "0";
            setTimeout(() => {
                this.canvas.style.transition = "opacity 2s ease-in-out";
                this.canvas.style.opacity = "1";
            }, 10);
            isRenderInProgress = false;
            this.reset();
            this.render();
        }, 256);
    }
    reset() {
        let width = 0.8 * document.body.clientWidth;
        let height = 0.8 * document.body.clientHeight;
        const phi = this.ratio;
        const controls = document.getElementById("controls");
        if (width > height) {
            controls.style.flexDirection = "column";
            width = Math.min(height * phi, width);
        }
        else {
            controls.style.flexDirection = "row";
            height = Math.min(width * phi, height);
            this.zoom = 2;
        }
        this.ratio = width / height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        const dpr = window.devicePixelRatio;
        const intrinsicWidth = Math.floor(width * dpr);
        const intrinsicHeight = Math.floor(height * dpr);
        if (width <= 0 || height <= 0) {
            console.error("Invalid main canvas width and height:", width, height);
        }
        this.canvas.width = intrinsicWidth;
        this.canvas.height = intrinsicHeight;
        this.width = intrinsicWidth;
        this.height = intrinsicHeight;
        const iterationsText = document.getElementById("iterations-text");
        if (iterationsText) {
            iterationsText.textContent = `Max iterations: ${this.maxIterations}`;
        }
    }
    render() {
        if (!isWorkerInitialized) {
            console.error("Request to render before worker is initialized. Attempt:", ++attempts);
            setTimeout(() => this.render(), 360);
            return false;
        }
        if (isRenderInProgress) {
            return false;
        }
        isRenderInProgress = true;
        worker.postMessage({
            type: "render",
            width: this.width,
            height: this.height,
            maxIterations: this.maxIterations,
            fullMaxIterations: this.fullMaxIterations,
            mid: this.mid,
            zoom: this.zoom,
            ratio: this.ratio,
            rFactor: this.rFactor,
            gFactor: this.gFactor,
            bFactor: this.bFactor,
            power: this.power,
            grayscale: this.grayscale,
        });
        return true;
    }
    handleWorkerMessage(event) {
        const data = event.data;
        if (data.type === "init") {
            isWorkerInitialized = true;
            this.render();
        }
        if (data.type === "render") {
            if (!isWorkerInitialized) {
                console.error("Worker is not initialized but still has sent us a rendered message. This shouldn't happen.");
                return;
            }
            ctx.drawImage(data.imageBitmap, 0, 0);
            isRenderInProgress = false;
        }
    }
}
//# sourceMappingURL=state.js.map