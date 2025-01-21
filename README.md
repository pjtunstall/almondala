# Almondala

![Mandelbrot](public/initial.jpg)

- [Description](#description)
- [Name](#name)
- [Usage](#usage)
- [Setup](#setup)
- [Experimental branches](#experimental-branches)
- [Benchmarking](#benchmarking)

## Description

[Almondala](https://almondala.netlify.app/) is a [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) explorer, written in Rust (compiled to WebAssembly) and TypeScript.

## Name

[Benoit Mandelbrot](https://en.wikipedia.org/wiki/Benoit_Mandelbrot), the set's discoverer, is German for "almond bread". I coined Almondala as a [portmanteau](https://en.wikipedia.org/wiki/Blend_word) of almond and [mandala](https://en.wikipedia.org/wiki/Mandala).

## Usage

- Keys:
  - Arrow keys to pan.
  - X to zoom in.
  - Z to zoom out.
  - SPACE to reset.
- Mouse:
  - Click on a point of the Mandelbrot to move it to the center of the canvas.
  - Double click to move and zoom.
  - Drag a point of the Mandelbrot move it to a new location on the canvas.

Resizing the window also resets the view.

## Setup

Simply view online at [Almondala](https://almondala.netlify.app/).

Alternatively, here is a guide to build and run locally. First, clone the repo and navigate into it by entering the following commands into a terminal:

```bash
git clone https://github.com/pjtunstall/almondala
cd almondala
```

[Install Rust](https://www.rust-lang.org/tools/install), if you haven't already.

Install Rust dependencies with

```bash
cargo add .
```

Make sure you have `wasm-pack` installed:

```bash
cargo install wasm-pack
```

Install [Node.js](https://nodejs.org/en) if you don't already have it. This will also install `npm` (Node Package Manager). Then install TypeScript and the related `undici-types` package as dev dependencies with the commmand

```
npm install
```

Run the build script with

```bash
npm run build
```

This will build the WebAssembly file `almondala_bg.wasm` to the `pkg` directory and copy it to the `public/wasm` directory along with its associated JavaScipt glue code `almondala.js` and the two TypeScript type-declaration files, `amondala.d.ts` and `almondala_bg.wasm.d.ts`. It concludes by correcting the import path for the glue from relative-to-the-TypeScript-source, as required by the TypeScript compiler, to relative-to-the-actual-compiled-JavaScript. It then deletes the superfluous `pkg`, which now contains only unwanted byproducts of the compilation process.

Start a local server. For example,

```bash
python3 -m http.server
```

Open a browser. When the popup prompts you, allow the application to accept incoming connections. Then navigate to `http://localhost:8000/public/`.

## Experimental branches

This repo includes several branches for exploring new features. At present they're in raw JavaScript, as they date to before I switched to using TypeScript for the project. Another significant change I've made to the main branch since I last touched any of these experiments is that I'm no longer trying to parallelize the Rust with the [rayon](https://docs.rs/rayon/latest/rayon/) crate (library). [Benchmarking](#benchmarking) showed, to my surprise, that `rayon` made the calculations 1.8 times slower. As I now realize, this is not how to do multithreading in WebAssembly.

- `fake`: a progressive loading effect: panning or zooming the current frame before calculating the next one. (Works up to a point: a series of pans and zooms will eventually get out of sync with the properly calculated view, maybe due accumulated rounding errors.)
- `offscreen`: two worker threads, each of which puts its image to an `OffscreenCanvas`. A request to calculate is sent to both simultaneously. One does a quick first pass with a smaller iteration limit. The main thread toggles the opacity of the two canvases to display the results as needed. (Works, but with occasional glitchy jumps, and reset is jarring on Firefox.)
- `lines`: an attempt at calculating odd and even numbered columns separately, one after the other, so as to have something to display faster, while waiting for the rest of the calculation. (The basic idea of calculating alternate lines works--the Rust does its job--but the branch is not yet fully functional. It derived from `offscreen`, and I think the two workers/canvases are complicting matters.)
- `shared`: an attempt at sharing memory betwee JS and Wasm. (Not yet working.)

See their `README`s for more info.

## Benchmarking

Here is how I timed the Mandelbrot calculation. With [rayon](https://docs.rs/rayon/latest/rayon/), the avarage duration was 903ms (standard deviation 51ms). Without `rayon`, it was 585ms (standard deviation 66ms). It turns out that WebAssembly doesn't have access to native multithreading capabilities, except indirectly via JavaScript worker threads.

```javascript
const phi = 1.618033988749895;

async function benchmarkMandelbrot() {
  const start = performance.now();

  calculate_mandelbrot(phi * 600, 600, 1024, 1024, -0.6, 0, phi, 1, 23, 17, 17);

  const end = performance.now();
  const duration = end - start;

  return duration;
}

const durations = [];
for (let i = 0; i < 100; i++) {
  const duration = await benchmarkMandelbrot();
  console.log(`${i}. ${duration}ms`);
  durations.push(duration);
}

const averageDuration =
  durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
console.log(`${averageDuration}ms (average)`);

const std = Math.sqrt(
  durations.reduce(
    (sum, duration) => sum + Math.pow(duration - averageDuration, 2),
    0
  ) / durations.length
);
console.log(std);
```
