import State from "./state.js";

let isWorkerInitialized = false;
let isRenderPending = false;
let isRenderScheduled = false;
let attempts = 0;

export default class Renderer {
  imageData: ImageData;
  ctx: CanvasRenderingContext2D;
  worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });

  constructor(imageData: ImageData, ctx: CanvasRenderingContext2D) {
    this.imageData = imageData;
    this.ctx = ctx;
    this.worker.onmessage = (event) => {
      const data = event.data;
      console.log(
        "Hi, I'm main and I just received a message with data:",
        data
      );

      if (data.type === "init") {
        console.log("Init message received in main.");
        isWorkerInitialized = true;
        // this.draw(2024, new State(17));
      }

      if (data.type === "render") {
        if (!isWorkerInitialized) {
          console.error(
            "Worked is not initialized but still has sent us a rendered message. This shouldn't happen."
          );
          return;
        }

        this.ctx.putImageData(data.newImageData, 0, 0);
        isRenderPending = false;

        // // I need to make state available here and pick a maxIterations. Maybe make draw a method of state.
        // if (isRenderScheduled) {
        //   this.draw(1024, new State(17));
        // }
      }
    };
  }

  draw(maxIterations: number, state: State) {
    if (!isWorkerInitialized) {
      console.error(
        "Request to render before worker is initialized. Attempt:",
        ++attempts
      );
      setTimeout(() => this.draw(maxIterations, state), 360);
      return;
    }

    if (isRenderPending) {
      isRenderScheduled = true;
      return;
    }

    isRenderPending = true;

    this.worker.postMessage({ type: "render", maxIterations, state });
  }
}
