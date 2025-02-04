export default class WorkerPool {
  idleWorkers: Worker[] = [];
  initPromises: Promise<unknown>[] = [];
  initResolvers: ((value: unknown) => void)[] = [];
  numWorkers: number;

  constructor(numWorkers: number) {
    this.numWorkers = numWorkers;

    for (let i = 0; i < numWorkers; i++) {
      this.idleWorkers.push(
        new Worker(new URL("./worker.js", import.meta.url), {
          type: "module",
        })
      );
      this.initPromises.push(
        new Promise((resolve) => {
          this.initResolvers.push(resolve);
        })
      );
    }
  }
}
