# Experimental branch: fake

This branch contains experimental work on a fake (i.e. progressive) loading effect for zoom and pan.

To see the fully functional and deployed version of this project, visit the [main branch](https://github.com/pjtunstall/almondala).

The idea is that before calculating the next image, the current image is panned or zoomed out (at the cost of showing blank space to the sides) or zoomed in (with loss of resolution). It feels more responsive because you can move faster if you hold down the keys. I find the blank space can be a bit jarring.

The effect works for zoom and pan individually. Combinations look ok till you release the keys, but they get more and more out of sync with the next calculated image. When you take your fingers off all keys, there's a jump from the faked image to the calculated one. It gets more noticeable, the longer the series of pans and zooms since the last one. I suspect this is due to accumulated rounding errors. I could restrict them to a single series of pans or series of zooms or at a time, but show the next fully calculated image if the user tries to switch between pan and zoom. Or I could try a different tack and derive the canvas coordinates for each faked frame from the actual complex plane coordinates, rather than from the cumulative canvas transformation matrix; this would be more ideal, but note that every conversion back from complex plan to canvas coordinate loses some precision as the canvas coordinates all have integer values.

When that's fixed, a next step could be to split the calculation up so that portions of the canvas can be displayed while others are still being calculated, giving an opportunity to interrupt the process if the user wants to move again. If some of the portions are calculated sequentially (synchronously), we'd avoid the performance drain of having to let all currently active calculations complete, which would take its toll even if new worker threads were launched to call the Wasm concurrently.

Originally, I thought the Rust was using the `rayon` crate to parallelize the calculations, and concluded that there wasn't any need to duplicate this with multiple JavaScript worker threads--but benchmarking showed that the calculation was 1.8 times faster without `rayon`. It turns out that Wasm doesn't inherently have multithreading support.

In any case, at least one worker would be useful, so as not block the main thread. That would let the user interact with the page in other ways. I could include the option to pan or zoom further, discarding the current calculation and seeing an immediate effect. I should be careful to limit how many times calculation is requested, so as not to generate a backlog.

Other details:

- The distinction between the two parameters `maxIterations` (`max_iterations`)) and `fullMaxIterations` (`full_max_terations`) are a relic of the version where I did a first pass with less maximum iterations while keys were held, and only did the full calculation when all keys were eventually released.

Things to test:

- Consider the variety of durations passed to `setTimeout`. Some are to ensure asynchronous operations happen in the right order. Make sure each value is necessary and reliable. Note exactly which operations could happen in the wrong order without them.
- Stress test combinations of mouse an key commands, and decide how they should interact.
