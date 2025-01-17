export function canvasToMandelCoords(x, y, zoom, width, height) {
    if (width <= 0 || height <= 0) {
        console.error(`Error: Height and width should be positive: height: ${height}, width: ${width}`);
        return [0, 0];
    }
    // View of 3.5 real units by 2.0 imaginary units in the complex plane.
    const cx = zoom * ((3.5 * x) / width - 1.75); // -1.75 shifts the real range left, so the left edge of the canvas corresponds to -1.75 on the real axis when zoom = 1, which it will whne you zoom ina  couple of times.
    const cy = zoom * ((2.0 * y) / height - 1.0); // -1.0 shifts the imaginary range up, so he top edge of the canvas corresponds to 1.0i when zoom = 1. The canvas has vertical coordinates increasing as they go down, the opposite of the complex plane, but the Mandelbrot is symmetric about the real axis, so there's no need to flip it.
    return [cx, cy];
}
export function canvasToMandelDelta(dx, dy, zoom, width, height) {
    const [x1, y1] = canvasToMandelCoords(0, 0, zoom, width, height);
    const [x2, y2] = canvasToMandelCoords(dx, dy, zoom, width, height);
    return [x2 - x1, y2 - y1];
}
//# sourceMappingURL=coordinate-transformations.js.map