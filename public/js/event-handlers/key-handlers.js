import requestReset from "./reset.js";
let prev = 0;
const keys = {};
export function handleKeys(timestamp, maxIterations, firstPassMaxIterations, fullMaxIterations, width, height, rFactor, gFactor, bFactor, canvas, ctx, renderer, state) {
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
                state.mid.x -= state.zoom * 0.4;
                break;
            case "ArrowRight":
                state.mid.x += state.zoom * 0.4;
                break;
            case "ArrowUp":
                state.mid.y += state.zoom * 0.4;
                break;
            case "ArrowDown":
                state.mid.y -= state.zoom * 0.4;
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