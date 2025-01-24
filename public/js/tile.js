"use strict";
// export default class Tile {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   row: number;
//   constructor(
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     row: number
//   ) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//     this.row = row;
//   }
//   static *tiles(
//     width: number,
//     height: number,
//     numRows: number,
//     numCols: number
//   ) {
//     let columnWidth = Math.ceil(width / numCols);
//     let rowHeight = Math.ceil(height / numRows);
//     for (let row = 0; row < numRows; row++) {
//       let tileHeight =
//         row < numRows - 1 ? rowHeight : height - rowHeight * (numRows - 1);
//       for (let col = 0; col < numCols; col++) {
//         let tileWidth =
//           col < numCols - 1 ? columnWidth : width - columnWidth * (numCols - 1);
//         let x = row % 2 === 0 ? col : numCols - 1 - col;
//         yield new Tile(
//           x * columnWidth,
//           row * rowHeight,
//           tileWidth,
//           tileHeight,
//           row
//         );
//       }
//     }
//   }
// }
//# sourceMappingURL=tile.js.map