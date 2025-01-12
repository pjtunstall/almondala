# Experimental branch: fake

This branch contains experimental work on a fake (i.e. progressive) loading effect for zoom and pan.

To see the fully functional and curently deployed version of this project, visit the main branch.

The effect works as intended for keypresses. Before calculating the next frame, the current frame is panned or zoomed out (at the cost of showing blank space to the sides) or zoomed in (with loss of resolution). It feels more responsive because you can move faster if you hold down the keys. The blank space can be a bit disorientating.

Once the Rust/Wasm function is called to do the calculations, you might have to wait significantly longer, which can be jarring. A next step could be to split the calculation up so that portions of the canvas can be displayed while others are still being calculated, giving an opportunity to interrupt the process if the user wants to move again. If some of the portions are calculated sequentially (synchronously), we'd avoid the performance drain of having to let all currently active calculations complete, which would take its toll even if new worker threads were launched to call the Wasm concurrently. The Rust is already using the `rayon` crate to parallelize the calculations, so I don't think there's any need to duplicate this with multiple JavaScript worker threads.

That said, one worker would be useful, so as not block the main thread, in case we want to allow the user to interact with the page in other ways. This could possibly include the option to pan or zoom further, discarding the current calculation and seeing and immediate effect. I should be careful to limit how many times calculation is requested, so as not to generate a backlog.
