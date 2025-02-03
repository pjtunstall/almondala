import { ComplexPoint } from "./points.js";
import Tile from "./tile.js";

const dpr = window.devicePixelRatio;
const panDelta = 0.1;
const rows = 1;
const cols = 2;
let cooldownTimer: ReturnType<typeof setTimeout> | null = null;
let isRenderInProgress = false;
let scheduledRenderTimer: ReturnType<typeof setTimeout>;
let requestId = 0;

export const worker1 = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
export const worker2 = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});

const workers = [worker1, worker2];

export const canvas = document.createElement("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
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
  grayscale: number;
  initialGrayscale = 23;
  maxIterations = 128;
  fullMaxIterations = 1024;
  rFactor = 1;
  gFactor = 1;
  bFactor = 1;
  canvas = canvas;
  ctx = ctx;
  tiles: Tile[] = [];
  initResolvers: any;

  constructor(grayscale: number, initResolvers: any) {
    this.initResolvers = initResolvers;
    this.grayscale = grayscale;

    worker1.onmessage = (event) => {
      this.handleWorkerMessage(event);
    };

    worker2.onmessage = (event) => {
      this.handleWorkerMessage(event);
    };
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

  zoomIn() {
    this.scaleZoomBy(0.96);
  }

  zoomInBig() {
    this.scaleZoomBy(Math.pow(0.96, 12));
  }

  zoomOut() {
    this.scaleZoomBy(1 / 0.96);
  }

  private scaleZoomBy(ds: number) {
    // // Zooming in further reaches the limits of floating point precision. But preventing it could give the impression that the controls are just not responding, unless some warning is given.
    // if (ds <= 1 && this.zoom < 2e-13) {
    //   return;
    // }
    this.zoom *= ds;
  }

  fakeRender(ds: number, dx: number, dy: number) {
    const width = canvas.width;
    const height = canvas.height;

    const spareCanvas = document.createElement("canvas");
    spareCanvas.width = width;
    spareCanvas.height = height;
    const spareCtx = spareCanvas.getContext("2d");
    if (!spareCtx) return;

    spareCtx.drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(ds, ds);
    ctx.translate((dx *= dpr), (dy *= dpr * this.ratio));
    ctx.translate(-width / 2, -height / 2);
    ctx.drawImage(spareCanvas, 0, 0);
    ctx.restore();
  }

  incrementPowerBy(increment: number) {
    this.power += increment;
    this.resetView();
  }

  private resetView(): void {
    this.zoom = 1;
    this.mid.x = this.power === 2 ? -0.6 : 0;
    this.mid.y = 0;

    const exponentText = document.getElementById("exponent-text");
    if (exponentText) {
      exponentText.textContent = `Exponent: ${this.power}`;
    }
  }

  requestReset() {
    if (cooldownTimer) clearTimeout(cooldownTimer);

    cooldownTimer = setTimeout(() => {
      Object.assign(this, {
        ...new State(this.grayscale, this.initResolvers),
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
    const controls = document.getElementById("controls") as HTMLElement;

    if (width > height) {
      controls.style.flexDirection = "column";
      width = Math.min(height * phi, width);
    } else {
      controls.style.flexDirection = "row";
      height = Math.min(width * phi, height);
      this.zoom = 2;
    }
    this.ratio = width / height;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    const intrinsicWidth = Math.floor(width * dpr);
    const intrinsicHeight = Math.floor(height * dpr);

    if (width <= 0 || height <= 0) {
      console.error("Invalid main canvas width and height:", width, height);
    }

    this.canvas.width = intrinsicWidth;
    this.canvas.height = intrinsicHeight;

    this.width = intrinsicWidth;
    this.height = intrinsicHeight;

    this.tiles = [...Tile.tiles(this.width, this.height, rows, cols)];

    const iterationsText = document.getElementById("iterations-text");
    if (iterationsText) {
      iterationsText.textContent = `Max iterations: ${this.maxIterations}`;
    }

    const exponentText = document.getElementById("exponent-text");
    if (exponentText) {
      exponentText.textContent = `Exponent: ${this.power}`;
    }
  }

  render(): boolean {
    if (isRenderInProgress) {
      clearTimeout(scheduledRenderTimer);
      scheduledRenderTimer = setTimeout(() => this.render(), 32);
      return false;
    }
    isRenderInProgress = true;

    for (let i = 0; i < workers.length; i++) {
      workers[i].postMessage({
        type: "render",
        requestId: requestId,
        tileWidth: this.tiles[i].width,
        tileHeight: this.tiles[i].height,
        canvasWidth: this.width,
        canvasHeight: this.height,
        maxIterations: this.maxIterations,
        fullMaxIterations: this.fullMaxIterations,
        tileLeft: this.tiles[i].x,
        tileTop: this.tiles[i].y,
        mid: this.mid,
        zoom: this.zoom,
        ratio: this.ratio,
        rFactor: this.rFactor,
        gFactor: this.gFactor,
        bFactor: this.bFactor,
        power: this.power,
        grayscale: this.grayscale,
      });
    }

    requestId++;

    return true;
  }

  renderResults: {
    [key: number]: { left?: ImageBitmap; right?: ImageBitmap };
  } = {};
  pendingRenders: Set<number> = new Set();

  handleWorkerMessage(event: MessageEvent) {
    const data = event.data;
    const { renderId, tileLeft, tileTop } = data;

    // if (renderId < requestId - 1) {
    //   return;
    // }

    if (data.type === "init") {
      console.log("init received");
      const resolver = this.initResolvers.pop();
      if (!resolver) {
        console.error("No resolver found");
        return;
      }
      resolver(data);
      return;
    }

    if (data.type === "render") {
      console.log(
        `Received renderId ${renderId} from worker, tileLeft: ${tileLeft}`
      );

      if (!this.renderResults[renderId]) {
        this.renderResults[renderId] = {};
      }

      if (tileLeft === 0) {
        this.renderResults[renderId].left = data.imageBitmap;
      } else {
        this.renderResults[renderId].right = data.imageBitmap;
      }

      if (!this.pendingRenders.has(renderId)) {
        this.pendingRenders.add(renderId);
      }

      if (
        this.renderResults[renderId].left &&
        this.renderResults[renderId].right
      ) {
        console.log(`Rendering synchronized renderId ${renderId}`);
        ctx.resetTransform();
        ctx.drawImage(this.renderResults[renderId].left!, 0, tileTop);
        ctx.drawImage(this.renderResults[renderId].right!, tileLeft, tileTop);
        delete this.renderResults[renderId];

        this.pendingRenders.delete(renderId);
        isRenderInProgress = false;
      }
    }
  }
}
