import { ComplexPoint } from "./points.js";

export default class State {
  zoom = 1;
  mid = new ComplexPoint(-0.6, 0);
  imageData = new ImageData(2, 2);
  ratio = 1.618033988749895;
  power = 2;
  grayscale: boolean;
  fullMaxIterations = 1024;
  rFactor = 23;
  gFactor = 17;
  bFactor = 17;
  private panDelta = 0.4;

  constructor(grayscale: boolean) {
    this.grayscale = grayscale;
  }

  panLeft() {
    this.mid.x -= this.zoom * this.panDelta;
  }

  panRight() {
    this.mid.x += this.zoom * this.panDelta;
  }

  panUp() {
    this.mid.y += this.zoom * this.panDelta;
  }

  panDown() {
    this.mid.y -= this.zoom * this.panDelta;
  }

  scaleZoomBy(factor: number) {
    if (factor <= 1 && this.zoom < 2e-13) {
      return;
    }
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
