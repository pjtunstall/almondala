# Almondala

![Mandelbrot](static/initial.jpg)

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

Run the build script with

```bash
npm run build
```

This will build the WebAssembly file almondala_bg.wasm to the pkg directory and copy it to the public/wasm directory along with its associated JavaScipt glue code `almondala.js`.

Start the local server (in server.go) with

```bash
go run .
```

Open a browser. When the popup prompts you, allow the application to accept incoming connections. Then navigate to `http://localhost:8080`.
