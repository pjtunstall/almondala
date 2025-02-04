export default class WorkerPool {
    idleWorkers = [];
    initPromises = [];
    initResolvers = [];
    numWorkers;
    constructor(numWorkers) {
        this.numWorkers = numWorkers;
        for (let i = 0; i < numWorkers; i++) {
            this.idleWorkers.push(new Worker(new URL("./worker.js", import.meta.url), {
                type: "module",
            }));
            this.initPromises.push(new Promise((resolve) => {
                this.initResolvers.push(resolve);
            }));
        }
    }
}
//# sourceMappingURL=worker-pool.js.map