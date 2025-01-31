let prev = 0; // Previous timestamp for replay loop.
let replayOut = true;
let currentZoom = 1;
export default function handleButtons(event, state) {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    target.blur();
    switch (target.id) {
        case "color":
            state.changeColor();
            break;
        case "replay":
            if (replayOut) {
                currentZoom = state.zoom;
            }
            if (currentZoom >= 1) {
                return;
            }
            requestAnimationFrame((timestamp) => {
                replay(timestamp, state, currentZoom);
            });
            break;
        case "plus":
            if (state.maxIterations < state.fullMaxIterations) {
                state.maxIterations *= 2;
                const iterationsText = document.getElementById("iterations-text");
                if (iterationsText) {
                    iterationsText.textContent = `Max iterations: ${state.maxIterations}`;
                }
            }
            break;
        case "minus":
            if (state.maxIterations > 1) {
                state.maxIterations /= 2;
                const iterationsText = document.getElementById("iterations-text");
                if (iterationsText) {
                    iterationsText.textContent = `Max iterations: ${state.maxIterations}`;
                }
            }
            break;
        case "power-up":
            state.incrementPowerBy(1);
            break;
        case "power-down":
            if (state.power > 2) {
                state.incrementPowerBy(-1);
            }
            break;
        case "info":
            document.querySelector(".modal")?.classList.add("open");
            document.body.classList.add("blurred");
            break;
        default:
            return;
    }
    state.render();
}
function replay(timestamp, state, currentZoom) {
    const zoomedAllTheWayOut = replayOut && state.zoom >= 1;
    const zoomedAllTheWayIn = !replayOut && state.zoom <= currentZoom;
    if (zoomedAllTheWayOut || zoomedAllTheWayIn) {
        replayOut = !replayOut;
        return;
    }
    requestAnimationFrame((timestamp) => replay(timestamp, state, currentZoom));
    if (timestamp - prev < 16) {
        return;
    }
    prev = timestamp;
    replayOut ? state.zoomOut() : state.zoomIn();
    state.fakeRender(replayOut ? 0.96 : 1 / 0.96, 0, 0);
    state.render();
}
//# sourceMappingURL=button-handlers.js.map