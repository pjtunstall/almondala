import { handleKeydown, handleKeyup, handleKeys, } from "./event-handlers/key-handlers.js";
import { handleSingleClick, handleDoubleClick, handleMousedown, } from "./event-handlers/mouse-handlers.js";
import handleButtons from "./event-handlers/button-handlers.js";
import State, { worker } from "./state.js";
export default class MandelbrotExplorer {
    state;
    constructor() {
        this.state = new State(23);
        this.state.reset();
        this.state.render();
        const iterationsText = document.createElement("div");
        iterationsText.id = "iterations-text";
        iterationsText.textContent = `Max iterations: ${this.state.maxIterations}`;
        document.body.appendChild(iterationsText);
        document.getElementById("controls")?.addEventListener("click", (event) => {
            handleButtons(event, this.state);
        });
        document.querySelector(".close-button")?.addEventListener("click", () => {
            const modal = document.querySelector(".modal");
            if (modal) {
                modal.classList.remove("open");
            }
        });
        document.addEventListener("keydown", (event) => handleKeydown(event.key));
        document.addEventListener("keyup", (event) => handleKeyup(event.key));
        document.addEventListener("mousedown", (event) => handleMousedown(event, this.state.canvas));
        this.state.canvas.addEventListener("mouseup", (event) => {
            handleSingleClick(event, this.state);
        });
        this.state.canvas.addEventListener("dblclick", (event) => {
            handleDoubleClick(event, this.state);
        });
        window.addEventListener("resize", async () => {
            this.state.requestReset();
        });
        requestAnimationFrame((timestamp) => {
            handleKeys(timestamp, this.state);
        });
        worker.onmessage = (event) => {
            this.state.handleWorkerMessage(event);
        };
    }
}
//# sourceMappingURL=mandelbrot-explorer.js.map