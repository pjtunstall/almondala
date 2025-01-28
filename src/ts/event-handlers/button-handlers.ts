import Renderer from "../draw.js";
import State from "../state.js";

export default function handleButtons(
  event: MouseEvent,
  state: State,
  renderer: Renderer
) {
  event.preventDefault();

  const target = event.target as HTMLElement;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  target.blur();

  switch (target.id) {
    case "color":
      state.changeColor();
      break;
    case "plus":
      if (state.maxIterations < state.fullMaxIterations) {
        state.maxIterations *= 2;
        const iterationsText = document.getElementById("iterations-text");
        if (iterationsText) {
          iterationsText.textContent = `Max iterations: ${state.maxIterations}`;
        }
      }
      break;
    case "minus":
      if (state.maxIterations > 2) {
        state.maxIterations /= 2;
        const iterationsText = document.getElementById("iterations-text");
        if (iterationsText) {
          iterationsText.textContent = `Max iterations: ${state.maxIterations}`;
        }
      }
      break;
    case "power-up":
      state.incrementPowerBy(1);
      break;
    case "power-down":
      if (state.power > 2) {
        state.incrementPowerBy(-1);
      }
      break;
    case "info":
      document.querySelector(".modal")?.classList.add("open");
      document.body.classList.add("blurred");
      break;
    default:
      return;
  }

  renderer.draw(state);
}
