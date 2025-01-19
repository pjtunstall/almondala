import requestReset from "./reset.js";
let prev = 0;
const keys = {};
export function handleKeys(timestamp, maxIterations, firstPassMaxIterations, fullMaxIterations, width, height, rFactor, gFactor, bFactor, canvas, ctx, renderer, state) {
    // The reason for using this key-handling mechanism--an asynchronous loop and `keys` object, rather than simply handling keypresses individually as each one occurs--is so that we can detect key chords (multiple simultaneous keypresses). It also allows us to throttle draw requests in one place. An object is used rather than a set because we don't just want to know if a key is currently down (in which case it's value will be `true`), but also whether it's been pressed and released since the previous iteration (in which case it will be `false`).
    requestAnimationFrame((timestamp) => handleKeys(timestamp, maxIterations, firstPassMaxIterations, fullMaxIterations, width, height, rFactor, gFactor, bFactor, canvas, ctx, renderer, state));
    if (timestamp - prev < 120) {
        return;
    }
    prev = timestamp;
    if (Object.keys(keys).length === 0) {
        prev = timestamp;
        return;
    }
    Object.keys(keys).forEach((key) => {
        switch (key) {
            case "ArrowLeft":
                state.midX -= state.zoom * 0.4;
                break;
            case "ArrowRight":
                state.midX += state.zoom * 0.4;
                break;
            case "ArrowUp":
                state.midY += state.zoom * 0.4;
                break;
            case "ArrowDown":
                state.midY -= state.zoom * 0.4;
                break;
            case "x":
                state.zoom *= 0.8;
                break;
            case "z":
                state.zoom *= 1.25;
                break;
            case " ":
                requestReset(canvas, ctx, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, renderer, state);
                if (keys[key] === false) {
                    delete keys[key];
                }
                return;
        }
        if (keys[key] === false) {
            delete keys[key];
        }
    });
    if (Object.keys(keys).length === 0) {
        maxIterations = fullMaxIterations;
    }
    else {
        maxIterations = firstPassMaxIterations;
    }
    renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state);
}
export function handleKeydown(key) {
    switch (key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "x":
        case "z":
        case " ":
            keys[key] = true;
    }
}
export function handleKeyup(key) {
    switch (key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "x":
        case "z":
        case " ":
            keys[key] = false;
    }
}
//# sourceMappingURL=key-handlers.js.map