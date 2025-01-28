import {
  handleKeydown,
  handleKeyup,
  handleKeys,
} from "./event-handlers/key-handlers.js";
import {
  handleSingleClick,
  handleDoubleClick,
  handleMousedown,
} from "./event-handlers/mouse-handlers.js";
import handleButtons from "./event-handlers/button-handlers.js";
import requestReset, { reset } from "./event-handlers/reset.js";
import Renderer from "./draw.js";
import State from "./state.js";

export default class MandelbrotExplorer {
  state: State;
  canvas = document.createElement("canvas") as HTMLCanvasElement;
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  renderer: Renderer;

  constructor() {
    this.state = new State(23);
    this.renderer = reset(this.canvas, this.ctx, this.state);

    if (!this.renderer) {
      console.error("Renderer initialization failed");
      return;
    }

    this.renderer.draw(this.state);

    const iterationsText = document.createElement("div");
    iterationsText.id = "iterations-text";
    iterationsText.textContent = `Max iterations: ${this.state.maxIterations}`;
    document.body.appendChild(iterationsText);

    document.body.appendChild(this.canvas);

    document.getElementById("controls")?.addEventListener("click", (event) => {
      handleButtons(event, this.state, this.renderer);
    });
    document.querySelector(".close-button")?.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      if (modal) {
        modal.classList.remove("open");
      }
    });

    document.addEventListener("keydown", (event) => handleKeydown(event.key));
    document.addEventListener("keyup", (event) => handleKeyup(event.key));
    document.addEventListener("mousedown", (event) =>
      handleMousedown(event, this.canvas)
    );

    this.canvas.addEventListener("mouseup", (event) => {
      handleSingleClick(
        event,
        this.canvas,
        this.ctx,
        this.renderer,
        this.state
      );
    });
    this.canvas.addEventListener("dblclick", (event) => {
      handleDoubleClick(
        event,
        this.canvas,
        this.ctx,
        this.renderer,
        this.state
      );
    });

    window.addEventListener("resize", async () => {
      requestReset(this.canvas, this.ctx, this.renderer, this.state);
    });

    requestAnimationFrame((timestamp) => {
      handleKeys(timestamp, this.canvas, this.ctx, this.renderer, this.state);
    });
  }
}
