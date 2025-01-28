import { ComplexPoint } from "./points.js";

const panDelta = 0.2;

export default class State {
  zoom = 1;
  mid = new ComplexPoint(-0.6, 0);
  width = 0;
  height = 0;
  ratio = 1.618033988749895;
  power = 2;
  grayscale: number;
  initialGrayscale = 23;
  maxIterations = 128;
  fullMaxIterations = 1024;
  rFactor = 1;
  gFactor = 1;
  bFactor = 1;

  constructor(grayscale: number) {
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

  scaleZoomBy(factor: number) {
    // // Zooming in further reaches the limits of floating point precision. But preventing it could give the impression that the controls are just not responding, unless some warning is given.
    // if (factor <= 1 && this.zoom < 2e-13) {
    //   return;
    // }
    this.zoom *= factor;
  }

  incrementPowerBy(increment: number) {
    this.power += increment;
    this.resetView();
  }

  private resetView(): void {
    this.zoom = 1;
    this.mid.x = this.power === 2 ? -0.6 : 0;
    this.mid.y = 0;
  }
}
