mod coloring;
mod escape;
mod perimeter;

use wasm_bindgen::prelude::*;

pub struct Params {
    max_iterations: usize,
    tile_width: usize,
    tile_height: usize,
    canvas_width: usize,
    canvas_height: usize,
    ratio: f64,
    tile_left: f64,
    tile_top: f64,
    mid_x: f64,
    mid_y: f64,
    scale: f64,
    power: i32,
}

#[wasm_bindgen]
pub fn calculate_mandelbrot(
    tile_width: usize,
    tile_height: usize,
    canvas_width: usize,
    canvas_height: usize,
    max_iterations: usize,
    tile_left: f64,
    tile_top: f64,
    mid_x: f64,
    mid_y: f64,
    scale: f64,
    ratio: f64,
    power: i32,
    grayscale: bool,
) -> Vec<u8> {
    let params = Params {
        tile_width,
        tile_height,
        canvas_width,
        canvas_height,
        max_iterations,
        tile_left,
        tile_top,
        mid_x,
        mid_y,
        scale,
        ratio,
        power,
    };

    if perimeter::is_perimeter_all_black(&params) {
        return vec![[0, 0, 0, 255]; tile_width * tile_height]
            .into_iter()
            .flatten()
            .collect();
    }

    (0..tile_width * tile_height)
        .flat_map(|index| {
            let x = index % tile_width;
            let y = index / tile_width;

            let escape_iteration = escape::get_escape_iteration(x, y, &params);

            if grayscale {
                coloring::shade(escape_iteration, max_iterations)
                // coloring::SHADE[escape_iteration]
            } else {
                coloring::color(escape_iteration, max_iterations)
                // coloring::COLOR[escape_iteration]
            }
        })
        .collect()
}
