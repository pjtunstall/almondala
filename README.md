# Almondala

![Mandelbrot](initial.jpg)

- [Description](#description)
- [Setup](#setup)
- [Usage](#usage)

## Description

A Mandelbrot set explorer, written in Rust (compiled to WebAssembly) and JackScript.

## Setup

Open a terminal and build with

```bash
https://github.com/pjtunstall/almondala
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

Build with:

```bash
wasm-pack build --target web --release
```

Start a server, for example with:

```bash
python3 -m http.server
```

Then open a browser and navigate to `http://localhost:8000/static/`.

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
