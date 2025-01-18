export function canvasToMandelCoords(x, y, width, height, state) {
    if (width <= 0 || height <= 0) {
        console.error(`Error: Height and width should be positive: height: ${height}, width: ${width}`);
        return [0, 0];
    }
    const { zoom, offsetX, offsetY } = state;
    const cx = 1.618033988749895 * (x / width - 0.5) * 3 * zoom - offsetX;
    const cy = (y / height - 0.5) * 3 * zoom - offsetY;
    return [cx, cy];
}
export function canvasToMandelDelta(dx, dy, width, height, state) {
    const [x1, y1] = canvasToMandelCoords(0, 0, width, height, state);
    const [x2, y2] = canvasToMandelCoords(dx, dy, width, height, state);
    return [x2 - x1, y2 - y1];
}
//# sourceMappingURL=coordinate-transformations.js.map