# Experimental branch: shared

This branch contains experimental work on sharing memory between JavaScript and WASM. It's not complete or deployed.

To see the fully functional and deployed version of this project, visit the [main branch](https://github.com/pjtunstall/almondala).

The plan was to create the shared memory buffer in the JavaScript main thread, then have the worker share it with the Rust/WASM, which would write to it, so that the result would be available for the worker to apply to an offscreen canvas. Can all that be done without copying? I don't know.

In any case, it's still not working. Based on asserts, it seems that the Rust considers the pointer to be null, even though it's well-defined in the JS. The issue may be finding the correct type for the Rust function `calculate_mandelbrot` to receive the buffer as. Here I'm trying `buffer_ptr: *mut u8`. Another suggestion was `&mut js_sys::Uint8Array`.
