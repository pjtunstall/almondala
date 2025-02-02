let prev; // Previous timestamp for replay loop.
let replayOut; // Is the next replay zoom going to be out or in?
let zoomThatReplayStartsAt; // When the replay starts, it will be set equal to the current state.zoom. During the replay, state.zoom changes as we zoom out, but zoomThatReplayStartsAt remembers where the zoom began so that we can zoom back in to the same level if the replay button is pressed a second time.
export default function handleButtons(event, state, replayer) {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    target.blur();
    let exponentText;
    switch (target.id) {
        case "color":
            state.changeColor();
            break;
        case "replay":
            if (replayOut) {
                zoomThatReplayStartsAt = state.zoom;
            }
            if (zoomThatReplayStartsAt >= 1) {
                return;
            }
            replayer.running = true;
            requestAnimationFrame((timestamp) => {
                replayer.replay(timestamp, state, zoomThatReplayStartsAt);
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
            zoomThatReplayStartsAt = 1;
            state.incrementPowerBy(1);
            exponentText = document.getElementById("exponent-text");
            if (exponentText) {
                exponentText.textContent = `Exponent: ${state.power}`;
            }
            break;
        case "power-down":
            zoomThatReplayStartsAt = 1;
            if (state.power > 2) {
                state.incrementPowerBy(-1);
            }
            exponentText = document.getElementById("exponent-text");
            if (exponentText) {
                exponentText.textContent = `Exponent: ${state.power}`;
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
export class Replayer {
    running = false;
    resetReplayVariables() {
        prev = 0;
        replayOut = true;
        zoomThatReplayStartsAt = 1;
    }
    replay(timestamp, state, zoomThatReplayStartsAt) {
        if (!this.running) {
            return;
        }
        const zoomedAllTheWayOut = replayOut && state.zoom >= 1;
        const zoomedAllTheWayIn = !replayOut && state.zoom <= zoomThatReplayStartsAt;
        if (zoomedAllTheWayOut || zoomedAllTheWayIn) {
            replayOut = !replayOut;
            return;
        }
        requestAnimationFrame((timestamp) => this.replay(timestamp, state, zoomThatReplayStartsAt));
        if (timestamp - prev < 16) {
            return;
        }
        prev = timestamp;
        replayOut ? state.zoomOut() : state.zoomIn();
        state.fakeRender(replayOut ? 0.96 : 1 / 0.96, 0, 0);
        state.render();
    }
}
//# sourceMappingURL=button-handlers.js.map