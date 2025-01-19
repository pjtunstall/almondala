import { CanvasPoint, Point } from "../points.js";
let dragStartX, dragStartY;
let singleClickTimeoutId;
export function handleMousedown(event, canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    dragStartX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    dragStartY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
}
export function handleDrag(event, canvas, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state) {
    const canvasRect = canvas.getBoundingClientRect();
    const currentX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    const currentY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
    const current = new CanvasPoint(currentX, currentY, state);
    const dragStart = new CanvasPoint(dragStartX, dragStartY, state);
    const dragDelta = dragStart.subtract(current);
    if (Point.dotProduct(dragDelta, dragDelta) < 5) {
        return false;
    }
    const canvasCenter = new CanvasPoint(0, 0, state);
    const complexDifference = canvasCenter.complexSubtract(dragDelta);
    state.midX -= complexDifference.x;
    state.midY -= complexDifference.y;
    dragStartX = currentX;
    dragStartY = currentY;
    requestAnimationFrame(() => renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state));
    return true;
}
function handleClick(event, canvas, state) {
    const oldCanvasCenter = new CanvasPoint(state.imageData.width / 2, state.imageData.height / 2, state);
    const canvasRect = canvas.getBoundingClientRect();
    const x = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    const y = (event.clientY - canvasRect.top) * window.devicePixelRatio;
    const newCanvasCenter = new CanvasPoint(x, y, state);
    const complexDifference = oldCanvasCenter.complexSubtract(newCanvasCenter);
    state.midX -= complexDifference.x;
    state.midY -= complexDifference.y;
}
export function handleSingleClick(event, canvas, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state) {
    if (handleDrag(event, canvas, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state)) {
        return;
    }
    clearTimeout(singleClickTimeoutId);
    singleClickTimeoutId = window.setTimeout(() => {
        handleClick(event, canvas, state);
        requestAnimationFrame(() => renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state));
    }, 200);
}
export function handleDoubleClick(event, canvas, maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, renderer, state) {
    clearTimeout(singleClickTimeoutId);
    handleClick(event, canvas, state);
    state.zoom *= 0.64;
    requestAnimationFrame(() => renderer.draw(maxIterations, fullMaxIterations, rFactor, gFactor, bFactor, ctx, state));
}
//# sourceMappingURL=mouse-handlers.js.map