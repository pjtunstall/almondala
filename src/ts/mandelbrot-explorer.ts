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
import State, { worker1, worker2 } from "./state.js";

export default class MandelbrotExplorer {
  state: State;
  replayer = new Replayer();

  constructor() {
    this.state = new State(23);
    this.state.reset();

    const replayText = document.createElement("div");
    replayText.id = "replay-text";
    replayText.classList.add("text");
    replayText.textContent = "Replay zoom";
    document.body.appendChild(replayText);

    const replay = document.getElementById("replay");
    replay?.addEventListener("mouseenter", () =>
      toggleVisibility(replayText, true)
    );
    replay?.addEventListener("mouseleave", () =>
      toggleVisibility(replayText, false)
    );

    const iterationsText = document.createElement("div");
    iterationsText.id = "iterations-text";
    iterationsText.classList.add("text");
    iterationsText.textContent = `Max iterations: ${this.state.maxIterations}`;
    document.body.appendChild(iterationsText);

    const exponentText = document.createElement("div");
    exponentText.id = "exponent-text";
    exponentText.classList.add("text");
    exponentText.textContent = `Exponent: ${this.state.power}`;
    document.body.appendChild(exponentText);

    document.getElementById("controls")?.addEventListener("click", (event) => {
      handleButtons(event, this.state, this.replayer);
    });
    document.querySelector(".close-button")?.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      if (modal) {
        modal.classList.remove("open");
      }
    });

    const plus = document.getElementById("plus");
    const minus = document.getElementById("minus");
    plus?.addEventListener("mouseenter", () =>
      toggleVisibility(iterationsText, true)
    );
    plus?.addEventListener("mouseleave", () =>
      toggleVisibility(iterationsText, false)
    );
    minus?.addEventListener("mouseenter", () =>
      toggleVisibility(iterationsText, true)
    );
    minus?.addEventListener("mouseleave", () =>
      toggleVisibility(iterationsText, false)
    );

    const powerUp = document.getElementById("power-up");
    const powerDown = document.getElementById("power-down");
    powerUp?.addEventListener("mouseenter", () =>
      toggleVisibility(exponentText, true)
    );
    powerUp?.addEventListener("mouseleave", () =>
      toggleVisibility(exponentText, false)
    );
    powerDown?.addEventListener("mouseenter", () =>
      toggleVisibility(exponentText, true)
    );
    powerDown?.addEventListener("mouseleave", () =>
      toggleVisibility(exponentText, false)
    );

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

    worker1.onmessage = (event) => {
      this.state.handleWorkerMessage(event);
    };

    worker2.onmessage = (event) => {
      this.state.handleWorkerMessage(event);
    };
  }
}

function toggleVisibility(element: HTMLElement, show: boolean) {
  if (element) element.style.opacity = show ? "1" : "0";
}
