import { ComplexPoint } from "./points.js";
const panDelta = 0.4;
export default class State {
    zoom = 1;
    mid = new ComplexPoint(-0.6, 0);
    imageData = new ImageData(2, 2);
    ratio = 1.618033988749895;
    power = 2;
    grayscale;
    fullMaxIterations = 1024;
    rFactor = 23;
    gFactor = 17;
    bFactor = 17;
    constructor(grayscale) {
        this.grayscale = grayscale;
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
        if (factor <= 1 && this.zoom < 2e-13) {
            return;
        }
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
}
//# sourceMappingURL=state.js.map