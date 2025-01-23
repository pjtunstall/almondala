import Renderer from ".././draw.js";
import State from ".././state.js";

let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

export default function requestReset(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  maxIterations: number,
  fullMaxIterations: number,
  rFactor: number,
  gFactor: number,
  bFactor: number,
  renderer: Renderer,
  state: State
) {
  if (cooldownTimer) clearTimeout(cooldownTimer);

  cooldownTimer = setTimeout(() => {
    Object.assign(state, {
      ...new State(state.grayscale),
    });
    renderer.imageData = reset(canvas, ctx, state).imageData;
    renderer.draw(
      maxIterations,
      fullMaxIterations,
      rFactor,
      gFactor,
      bFactor,
      ctx,
      state
    );
  }, 256);
}

export function reset(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: State
): Renderer {
  let width = 0.8 * document.body.clientWidth;
  let height = 0.8 * document.body.clientHeight;
  const phi = state.ratio;
  const controls = document.getElementById("controls") as HTMLElement;

  if (width > height) {
    controls.style.flexDirection = "column";
    width = Math.min(height * phi, width);
  } else {
    controls.style.flexDirection = "row";
    height = Math.min(width * phi, height);
    state.zoom = 2;
  }
  state.ratio = width / height;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  if (canvas.width <= 0 || canvas.height <= 0) {
    console.error(
      "Canvas dimensions are invalid:",
      canvas.width,
      canvas.height
    );
  }

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  if (!imageData) {
    console.error("createImageData failed.");
  }
  state.imageData = imageData;
  const renderer = new Renderer(imageData);

  return renderer;
}
