import { ComplexPoint } from "./points.js";
export default class State {
    zoom = 1;
    mid = new ComplexPoint(-0.6, 0);
    imageData = new ImageData(2, 2);
    ratio = 1.618033988749895;
    power = 2;
    incrementPowerBy(change) {
        this.power += change;
        this.resetView();
    }
    resetView() {
        this.zoom = 1;
        this.mid.x = this.power === 2 ? -0.6 : 0;
        this.mid.y = 0;
    }
}
//# sourceMappingURL=state.js.map