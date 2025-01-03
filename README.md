# Almondala

## Description

A WASM-based Mandelbrot set explorer.

## Setup

Open a terminal and build with:

```bash
https://github.com/pjtunstall/almondala
cd almondala
```

[Install Rust](https://www.rust-lang.org/tools/install), if you haven't already.

Install Rust dependencies with:

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

- Arrow keys to pan.
- Z to zoom out.
- X to zoom in.
