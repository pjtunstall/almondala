import { canvasToMandelCoords, canvasToMandelDelta, } from "../coordinate-transformations.js";
let dragStartX, dragStartY;
let singleClickTimeoutId;
export function handleMousedown(event, canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    dragStartX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    dragStartY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
}
export function handleDrag(event, canvas, width, height, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state) {
    const canvasRect = canvas.getBoundingClientRect();
    const currentX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    const currentY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
    const dragDeltaX = currentX - dragStartX;
    const dragDeltaY = currentY - dragStartY;
    if (dragDeltaX * dragDeltaX + dragDeltaY * dragDeltaY < 5) {
        return false;
    }
    const [dx, dy] = canvasToMandelDelta(dragDeltaX, dragDeltaY, width, height, state);
    state.offsetX += dx;
    state.offsetY += dy;
    dragStartX = currentX;
    dragStartY = currentY;
    requestAnimationFrame(() => renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state));
    return true;
}
function handleClick(event, canvas, width, height, state) {
    const canvasRect = canvas.getBoundingClientRect();
    const x = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    const y = (event.clientY - canvasRect.top) * window.devicePixelRatio;
    const [cx, cy] = canvasToMandelCoords(x, y, width, height, state);
    state.offsetX -= cx;
    state.offsetY -= cy;
}
export function handleSingleClick(event, canvas, width, height, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state) {
    if (handleDrag(event, canvas, width, height, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state)) {
        return;
    }
    clearTimeout(singleClickTimeoutId);
    singleClickTimeoutId = window.setTimeout(() => {
        handleClick(event, canvas, width, height, state);
        requestAnimationFrame(() => renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state));
    }, 200);
}
export function handleDoubleClick(event, canvas, width, height, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state) {
    clearTimeout(singleClickTimeoutId);
    handleClick(event, canvas, width, height, state);
    state.zoom *= 0.64;
    state.offsetX += state.zoom * 0.4;
    requestAnimationFrame(() => renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state));
}
//# sourceMappingURL=mouse-handlers.js.map