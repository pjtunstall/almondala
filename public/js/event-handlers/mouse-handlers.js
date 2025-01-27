import { CanvasPoint, Point } from "../points.js";
let dragStartX, dragStartY;
let singleClickTimeoutId;
export function handleMousedown(event, canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    dragStartX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    dragStartY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
}
export function handleDrag(event, canvas, maxIterations, ctx, renderer, state) {
    const canvasRect = canvas.getBoundingClientRect();
    const currentX = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    const currentY = (event.clientY - canvasRect.top) * window.devicePixelRatio;
    const dragEnd = new CanvasPoint(currentX, currentY, state).toComplexPoint();
    const dragStart = new CanvasPoint(dragStartX, dragStartY, state).toComplexPoint();
    const dragDelta = dragStart.subtract(dragEnd);
    if (Point.dotProduct(dragDelta, dragDelta) === 0) {
        return false;
    }
    state.mid = state.mid.add(dragDelta);
    dragStartX = currentX;
    dragStartY = currentY;
    requestAnimationFrame(() => renderer.draw(state));
    return true;
}
function handleClick(event, canvas, state) {
    const canvasRect = canvas.getBoundingClientRect();
    const x = (event.clientX - canvasRect.left) * window.devicePixelRatio;
    const y = (event.clientY - canvasRect.top) * window.devicePixelRatio;
    const mid = new CanvasPoint(x, y, state).toComplexPoint();
    state.mid = mid;
}
export function handleSingleClick(event, canvas, maxIterations, ctx, renderer, state) {
    if (handleDrag(event, canvas, maxIterations, ctx, renderer, state)) {
        return;
    }
    clearTimeout(singleClickTimeoutId);
    singleClickTimeoutId = window.setTimeout(() => {
        handleClick(event, canvas, state);
        requestAnimationFrame(() => renderer.draw(state));
    }, 200);
}
export function handleDoubleClick(event, canvas, maxIterations, ctx, renderer, state) {
    clearTimeout(singleClickTimeoutId);
    handleClick(event, canvas, state);
    state.scaleZoomBy(0.64);
    requestAnimationFrame(() => renderer.draw(state));
}
//# sourceMappingURL=mouse-handlers.js.map