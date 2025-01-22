import { ComplexPoint } from "./points.js";
export default class State {
    zoom = 1;
    mid = new ComplexPoint(-0.6, 0);
    imageData = new ImageData(2, 2);
    ratio = 1.618033988749895;
    power = 2;
    panDelta = 0.4;
    moveLeft() {
        this.mid.x -= this.zoom * this.panDelta;
    }
    moveRight() {
        this.mid.x += this.zoom * this.panDelta;
    }
    moveUp() {
        this.mid.y += this.zoom * this.panDelta;
    }
    moveDown() {
        this.mid.y -= this.zoom * this.panDelta;
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