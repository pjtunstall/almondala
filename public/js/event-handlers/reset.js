import Renderer from ".././draw.js";
import State from ".././state.js";
let cooldownTimer = null;
export default function requestReset(canvas, ctx, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, renderer, state) {
    if (cooldownTimer)
        clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(() => {
        Object.assign(state, {
            ...new State(state.grayscale),
        });
        renderer.imageData = reset(canvas, ctx, state).imageData;
        renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state);
    }, 256);
}
export function reset(canvas, ctx, state) {
    let width = 0.8 * document.body.clientWidth;
    let height = 0.8 * document.body.clientHeight;
    const phi = state.ratio;
    if (width > height) {
        width = Math.min(height * phi, width);
    }
    else {
        height = Math.min(width * phi, height);
        state.zoom = 2;
    }
    state.ratio = width / height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    if (canvas.width <= 0 || canvas.height <= 0) {
        console.error("Canvas dimensions are invalid:", canvas.width, canvas.height);
    }
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    if (!imageData) {
        console.error("createImageData failed.");
    }
    state.imageData = imageData;
    const renderer = new Renderer(imageData);
    return renderer;
}
//# sourceMappingURL=reset.js.map