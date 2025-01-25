export default class Tile {
  top: number;
  left: number;
  width: number;
  height: number;
  row: number;

  constructor(
    top: number,
    left: number,
    width: number,
    height: number,
    row: number
  ) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.row = row;
  }

  static *tiles(
    width: number,
    height: number,
    numRows: number,
    numCols: number
  ) {
    let columnWidth = Math.ceil(width / numCols);
    let rowHeight = Math.ceil(height / numRows);

    for (let row = 0; row < numRows; row++) {
      let tileHeight =
        row < numRows - 1 ? rowHeight : height - rowHeight * (numRows - 1);

      for (let col = 0; col < numCols; col++) {
        let tileWidth =
          col < numCols - 1 ? columnWidth : width - columnWidth * (numCols - 1);

        let x = row % 2 === 0 ? col : numCols - 1 - col;

        yield new Tile(
          4 * x * columnWidth,
          row * rowHeight,
          4 * tileWidth,
          tileHeight,
          row
        );
      }
    }
  }
}

export class TileResult {
  pixels: Uint8ClampedArray;
  top: number;
  left: number;
  width: number;
  height: number;

  constructor(
    pixels: Uint8ClampedArray,
    top: number,
    left: number,
    width: number,
    height: number
  ) {
    this.pixels = pixels;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }
}
