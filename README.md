# Experimental branch: offscreen

This branch contains experimental work on using worker threads and offscreen canvases to avoid blocking the main thread. It's not complete or deployed.

To see the fully functional and deployed version of this project, visit the [main branch](https://github.com/pjtunstall/almondala).

In this branch, I have two worker threads: fast and slow. When the main thread initiates a render, the fast worker calls the Rust function with a lower number of maximum iterations. At the same time, the slow worker calls it with a higher value. In this way, a provisional image can be displayed while waiting for the full result.

Each worker puts its result onto its own [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas). The main thread toggles the opacity of the two canvases as needed.

As in the main branch, I only do the full calculation when the zoom and pan keys are released.

It works except that I see occasional glitchy jumps when switching between canvases. In Firefox, there's a flash of the background color on reset, except when the Mandelbrot has not been moved (panned or zoomed).

I should investigate what happens if the slow draw completes first.

Also unsatisfying is the fact that the provisional result doesn't contribute towards the final one, and must slow it a bit, even if it feels faster, thanks to the more immediate first result. I could try caching the results, but should benchmark as I do so; an earlier experiment where I checked for revisited points on each iteration actually turned out to be slower than simply calculating all iterations up to the maximum or till the point escaped beyond two units of the origin.

The experiment originated in an attempt to use a worker thread and offscreen canvas while sharing memory between WASM and JS. I was struggling to accomplish that, and wanted to see if I could, at least, get the offscreen canvas part working. That attempt is represented by the branch [shared](https://github.com/pjtunstall/almondala/tree/shared).
