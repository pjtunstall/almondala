import { ComplexPoint } from "./points.js";
export default class State {
    zoom = 1;
    mid = new ComplexPoint(-0.6, 0);
    imageData = new ImageData(2, 2);
    ratio = 1.618033988749895;
}
