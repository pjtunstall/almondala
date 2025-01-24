"use strict";
// import tile from "./tile.js";
// class TileWorker extends Worker {
//   index: number;
//   constructor(source: string, index: number) {
//     super(source);
//     this.index = index;
//   }
// }
// export default class WorkerPool {
//   idleWorkers: any;
//   workQueue: any;
//   workerMap: any;
//   constructor(numWorkers: number, workerSource: string) {
//     this.idleWorkers = [];
//     this.workQueue = [[], []];
//     this.workerMap = new Map(); // Map workers to resolve and reject functions.
//     for (let i = 0; i < numWorkers; i++) {
//       let worker = new TileWorker(workerSource, i);
//       worker.index = i;
//       worker.onmessage = (message) => {
//         this.workerDone(worker, null, message.data);
//       };
//       worker.onerror = (error) => {
//         this.workerDone(worker, error, null);
//       };
//       this.idleWorkers[i] = worker;
//     }
//   }
//   private workerDone(
//     worker: TileWorker,
//     error: ErrorEvent | null,
//     response: Uint8Array | null
//   ) {
//     let [resolver, rejector] = this.workerMap.get(worker);
//     this.workerMap.delete(worker);
//     if (this.workQueue[worker.index % 2].length === 0) {
//       this.idleWorkers.push(worker);
//     } else {
//       let [work, resolver, rejector] = this.workQueue[worker.index % 2].shift();
//       this.workerMap.set(worker, [resolver, rejector]);
//       worker.postMessage(work);
//     }
//     error === null ? resolver(response) : rejector(error);
//   }
//   addWork(work: tile, row: number) {
//     return new Promise((resolve, reject) => {
//       if (this.idleWorkers.length > 0) {
//         let worker = this.idleWorkers.pop();
//         this.workerMap.set(worker, [resolve, reject]);
//         worker.postMessage(work);
//       } else {
//         this.workQueue[row % 2].push([work, resolve, reject]);
//       }
//     });
//   }
// }
//# sourceMappingURL=worker-pool.js.map