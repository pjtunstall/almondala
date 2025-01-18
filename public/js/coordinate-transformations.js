export function canvasToMandelCoords(x, y, width, height, state) {
    if (width <= 0 || height <= 0) {
        console.error(`Error: Height and width should be positive: height: ${height}, width: ${width}`);
        return [0, 0];
    }
    const { zoom, offsetX, offsetY, ratio } = state;
    const cx = ratio * (x / width - 0.5) * 3 * zoom - offsetX;
    const cy = (y / height - 0.5) * 3 * zoom - offsetY;
    return [cx, cy];
}
export function canvasToMandelDelta(x1, y1, x2, y2, width, height, state) {
    const [cx1, cy1] = canvasToMandelCoords(x1, y1, width, height, state);
    const [cx2, cy2] = canvasToMandelCoords(x2, y2, width, height, state);
    return [cx2 - cx1, cy2 - cy1];
}
//# sourceMappingURL=coordinate-transformations.js.map