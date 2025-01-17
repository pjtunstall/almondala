import Renderer from ".././draw.js";
import State from ".././state.js";
const phi = 1.618033988749895;
let cooldownTimer = null;
export default function requestReset(canvas, ctx, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, renderer, state) {
    if (cooldownTimer)
        clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(() => {
        Object.assign(state, { ...new State() });
        renderer.imageData = reset(canvas, ctx).imageData;
        renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state);
    }, 256);
}
export function reset(canvas, ctx) {
    let width = 0.8 * document.body.clientWidth;
    let height = 0.8 * document.body.clientHeight;
    if (width > height) {
        width = height * phi;
    }
    else {
        height = width / phi;
    }
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
    const renderer = new Renderer(imageData);
    return renderer;
}
//# sourceMappingURL=reset.js.map