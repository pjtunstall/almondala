export default class WorkerPool {
  idleWorkers: Worker[] = [];
  initPromises: Promise<unknown>[] = [];
  initResolvers: ((value: unknown) => void)[] = [];
  numWorkers: number;

  constructor(numWorkers: number) {
    this.numWorkers = numWorkers;

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
      this.idleWorkers.push(worker);
      this.initPromises.push(
        new Promise((resolve) => {
          this.initResolvers.push(resolve);
        })
      );
      worker.onmessage = (event: MessageEvent) => {
        this.handleWorkerInitMessage(event);
      };
    }
  }

  handleWorkerInitMessage(event: MessageEvent) {
    const data = event.data;
    if (data.type === "init") {
      const resolver = this.initResolvers.pop();
      if (!resolver) {
        console.error("No resolver found");
        return;
      }
      resolver(data);
      return;
    } else {
      console.error("Expected message type 'init', got", data.type);
    }
  }
}
