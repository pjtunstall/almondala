export default class Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    row: number
  ) {
    this.x = x;
    this.y = y;
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
    let baseColumnWidth = Math.floor(width / numCols);
    let baseRowHeight = Math.floor(height / numRows);

    let extraWidth = width % numCols;
    let extraHeight = height % numRows;

    for (let row = 0; row < numRows; row++) {
      let y = row * baseRowHeight + Math.min(row, extraHeight); // Add 1 extra pixel for the first `extraHeight` rows
      let tileHeight = baseRowHeight + (row < extraHeight ? 1 : 0); // Rows get 1 extra pixel if `row < extraHeight`

      for (let col = 0; col < numCols; col++) {
        let x = col * baseColumnWidth + Math.min(col, extraWidth); // Add 1 extra pixel for the first `extraWidth` columns
        let tileWidth = baseColumnWidth + (col < extraWidth ? 1 : 0); // Columns get 1 extra pixel if `col < extraWidth`

        console.log(x, y, tileWidth, tileHeight, row);

        yield new Tile(x, y, tileWidth, tileHeight, row);
      }
    }
  }
}
