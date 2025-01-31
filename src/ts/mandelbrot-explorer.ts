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
import handleButtons, { Replayer } from "./event-handlers/button-handlers.js";
import State, { worker } from "./state.js";

export default class MandelbrotExplorer {
  state: State;
  replayer = new Replayer();

  constructor() {
    this.state = new State(23);
    this.state.reset();

    const iterationsText = document.createElement("div");
    iterationsText.id = "iterations-text";
    iterationsText.textContent = `Max iterations: ${this.state.maxIterations}`;
    document.body.appendChild(iterationsText);

    document.getElementById("controls")?.addEventListener("click", (event) => {
      handleButtons(event, this.state, this.replayer);
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
      handleMousedown(event, this.state.canvas)
    );

    this.state.canvas.addEventListener("mouseup", (event) => {
      handleSingleClick(event, this.state);
    });
    this.state.canvas.addEventListener("dblclick", (event) => {
      handleDoubleClick(event, this.state);
    });

    window.addEventListener("resize", async () => {
      this.state.requestReset();
    });

    // Initialize variables associated with replay.
    this.replayer.resetReplayVariables();

    // Stop replay loop if new user input should interrupt it.
    const replayer = this.replayer;
    ["click", "keydown", "resize"].forEach((eventType) =>
      window.addEventListener(eventType, (event) => {
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        if (target.id === "replay" || target.id === "color") {
          return;
        }
        replayer.running = false;
        replayer.resetReplayVariables();
      })
    );

    requestAnimationFrame((timestamp) => {
      handleKeys(timestamp, this.state);
    });

    worker.onmessage = (event) => {
      this.state.handleWorkerMessage(event);
    };
  }
}
