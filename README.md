# Almondala

![Mandelbrot](initial.jpg)

- [Description](#description)
- [Usage](#usage)
- [Setup](#setup)

## Description

[Almondala](https://almondala.netlify.app/) is a [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) explorer, written in Rust (compiled to WebAssembly) and JavaScript.

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

Compile the Rust to WebAssembly with

```bash
wasm-pack build --target web --release
```

Then move the `.wasm` file, `almondala_bg.wasm`, and its associated glue script (wasm-bindgen JavaScript wrapper), `almondala.js`, from the new `pkg/` folder, which `wasm-pack` should just have produced, to `static/pkg/` (replacing any previously built versions):

```bash
mv pkg/almondala_bg.wasm pkg/almondala.js static/pkg/
```

Start a server, for example with

```bash
python3 -m http.server
```

Finally, open a browser and navigate to `http://localhost:8000/static/`.
