export default function handleButtons(event, state, renderer) {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    target.blur();
    switch (target.id) {
        case "color":
            state.changeColor();
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
    renderer.draw(state.fullMaxIterations, state);
}
//# sourceMappingURL=button-handlers.js.map