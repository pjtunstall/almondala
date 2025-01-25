import { TileResult } from "./tile.js";
class TileWorker extends Worker {
    index;
    constructor(source, index) {
        super(new URL(source, import.meta.url), { type: "module" });
        this.index = index;
        console.log("In TileWorker constructor");
    }
}
export default class WorkerPool {
    idleWorkers;
    workQueue;
    workerMap = new Map();
    constructor(numWorkers, workerSource) {
        this.idleWorkers = [];
        // this.workQueue = [[], []];
        this.workQueue = [];
        for (let i = 0; i < numWorkers; i++) {
            let worker = new TileWorker(workerSource, i);
            if (!worker) {
                console.error("No worker. Why not?");
            }
            worker.index = i;
            worker.onmessage = (message) => {
                // console.log("Returned message.data", message.data);
                // console.log("message data init", message.data.init);
                // if (message.data.init) {
                //   console.log("init received");
                //   return;
                // }
                const { pixels, top, left, width, height } = message.data;
                console.log("pixels", pixels);
                this.workerDone(worker, null, new TileResult(pixels, top, left, width, height));
            };
            worker.onerror = (error) => {
                console.error(`Worker ${worker.index} onerror: ${error}`);
                console.error("Worker error details:", error.message || error);
                this.workerDone(worker, error, null);
            };
            this.idleWorkers[i] = worker;
        }
    }
    workerDone(worker, error, response) {
        const pair = this.workerMap.get(worker);
        if (!pair) {
            console.error("Worker not found in workerMap:", worker);
            return;
        }
        const [resolver, rejector] = pair;
        this.workerMap.delete(worker);
        // if (this.workQueue[worker.index % 2].length === 0) {
        if (this.workQueue.length === 0) {
            this.idleWorkers.push(worker);
        }
        else {
            //   let [work, resolver, rejector] = this.workQueue[worker.index % 2].shift();
            let [work, resolver, rejector] = this.workQueue.shift();
            this.workerMap.set(worker, [resolver, rejector]);
            worker.postMessage(work);
        }
        error === null ? resolver(response) : rejector(error);
    }
    addWork(tile, row, state, maxIterations) {
        return new Promise((resolve, reject) => {
            if (this.idleWorkers.length > 0) {
                let worker = this.idleWorkers.pop();
                this.workerMap.set(worker, [resolve, reject]);
                worker.postMessage({ tile, state, maxIterations });
            }
            else {
                // this.workQueue[row % 2].push([
                this.workQueue.push([{ tile, state, maxIterations }, resolve, reject]);
            }
        });
    }
}
//# sourceMappingURL=worker-pool.js.map