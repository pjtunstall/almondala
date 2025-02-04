export default class WorkerPool {
    idleWorkers = [];
    initPromises = [];
    initResolvers = [];
    numWorkers;
    constructor(numWorkers) {
        this.numWorkers = numWorkers;
        for (let i = 0; i < numWorkers; i++) {
            const worker = new Worker(new URL("./worker.js", import.meta.url), {
                type: "module",
            });
            this.idleWorkers.push(worker);
            this.initPromises.push(new Promise((resolve) => {
                this.initResolvers.push(resolve);
            }));
            worker.onmessage = (event) => {
                this.handleWorkerInitMessage(event);
            };
        }
    }
    handleWorkerInitMessage(event) {
        const data = event.data;
        if (data.type === "init") {
            console.log("init received");
            const resolver = this.initResolvers.pop();
            if (!resolver) {
                console.error("No resolver found");
                return;
            }
            resolver(data);
            return;
        }
    }
}
//# sourceMappingURL=worker-pool.js.map