export default class Tile {
    top;
    left;
    width;
    height;
    row;
    constructor(top, left, width, height, row) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.row = row;
    }
    static *tiles(width, height, numRows, numCols) {
        let columnWidth = Math.ceil(width / numCols);
        let rowHeight = Math.ceil(height / numRows);
        for (let row = 0; row < numRows; row++) {
            let tileHeight = row < numRows - 1 ? rowHeight : height - rowHeight * (numRows - 1);
            for (let col = 0; col < numCols; col++) {
                let tileWidth = col < numCols - 1 ? columnWidth : width - columnWidth * (numCols - 1);
                let x = row % 2 === 0 ? col : numCols - 1 - col;
                yield new Tile(4 * x * columnWidth, row * rowHeight, 4 * tileWidth, tileHeight, row);
            }
        }
    }
}
export class TileResult {
    pixels;
    top;
    left;
    width;
    height;
    constructor(pixels, top, left, width, height) {
        this.pixels = pixels;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}
//# sourceMappingURL=tile.js.map