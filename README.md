# Almondala

![Mandelbrot](public/initial.jpg)

- [Description](#description)
- [Name](#name)
- [Usage](#usage)
- [Setup](#setup)
- [Experimental branches](#experimental-branches)

## Description

[Almondala](https://almondala.netlify.app/) is a [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) explorer, written in Rust (compiled to WebAssembly) and JavaScript.

## Name

Mandelbrot, from [Benoit Mandelbrot](https://en.wikipedia.org/wiki/Benoit_Mandelbrot), the set's discoverer, is German for "almond bread". I coined Almondala as a [portmanteau](https://en.wikipedia.org/wiki/Blend_word) of almond and [mandala](https://en.wikipedia.org/wiki/Mandala).

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

Run the build script with

```bash
npm run build
```

This will build the WebAssembly file almondala_bg.wasm to the pkg directory and copy it to the public/wasm directory along with its associated JavaScipt glue code `almondala.js`.

Start a local server. For example,

```bash
python3 -m http.server
```

Open a browser. When the popup prompts you, allow the application to accept incoming connections. Then navigate to `http://localhost:8000/public/`.

## Experimental branches

This repo includes several branches for exploring new features:

- `fake`: a progressive loading effect: panning or zooming the current frame before calculating the next one. (I need to fix the alignment of fake pan with real pan. There are issues with how fake pan and zoom combine, especially when the pan starts first. The effect of blank space coming in from the side on fake pan is inherently a bit jarring.)
- `offscreen`: two worker threads, each of which puts its image to an `OffscreenCanvas`. A request to calculate is sent to both simultaneously. One does a quick first pass with a smaller iteration limit. The main thread toggles the opacity of the two canvases to display the results as needed. (Works, but with occasional glitchy jumps, and reset is jarring on Firefox.)
- `lines`: an attempt at calculating odd and even numbered columns separately, one after the other, so as to have something to display faster, while waiting for the rest of the calculation. (The basic idea of calculating alternate lines works--the Rust does its job--but the branch is not yet fully functional. It derived from `offscreen`, and I think the two workers/canvases are complicting matters.)
- `shared`: an attempt at sharing memory betwee JS and Wasm. (Not yet working.)

See their `README`s for more info.
