# Experimental branch: fake

This branch contains experimental work on a fake (i.e. progressive) loading effect for zoom and pan.

To see the fully functional and curently deployed version of this project, visit the main branch.

The idea is that before calculating the next frame, the current frame is panned or zoomed out (at the cost of showing blank space to the sides) or zoomed in (with loss of resolution). It feels more responsive because you can move faster if you hold down the keys. The blank space can be a bit disorientating.

The effect works up to a point. Individually keypresses are fine except that dividing the percentage of pan by `fakeScale` in `handleKeys` fails to perfectly align the fake pan with the real one; the amount by which it jumps when the real pan is applied is sensitive to window size. More problematic are simultaneous combinations of fake pan and zoom. The effect is not bad (apart from that imperfect pan alignment) when zoom is pressed first, but glitchy the other way round. For the latter case, I need to decide how I want such combinations to behave and whether to even allow them.

When these issue are fixed, a next step could be to split the calculation up so that portions of the canvas can be displayed while others are still being calculated, giving an opportunity to interrupt the process if the user wants to move again. If some of the portions are calculated sequentially (synchronously), we'd avoid the performance drain of having to let all currently active calculations complete, which would take its toll even if new worker threads were launched to call the Wasm concurrently. The Rust is already using the `rayon` crate to parallelize the calculations, so I don't think there's any need to duplicate this with multiple JavaScript worker threads.

That said, one worker would be useful, so as not block the main thread, in case we want to allow the user to interact with the page in other ways. This could possibly include the option to pan or zoom further, discarding the current calculation and seeing and immediate effect. I should be careful to limit how many times calculation is requested, so as not to generate a backlog.

Other details:

- Consider the variety of durations passed to `setTimeout`. Some are to ensure asynchronous operations happen in the right order. Make sure each value is necessary and reliable. Note exactly which operations could happen in the wrong order without them.
- The distinction between the two parameters `maxIterations` (`max_iterations`)) and `fullMaxIterations` (`full_max_terations`) are a relic of the version where I did a first pass with less maximum iterations while keys were held, and only did the full calculation when all keys were eventually released.
