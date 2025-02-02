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
    zoom: f64,
    power: i32,
}

#[wasm_bindgen]
pub fn calculate_mandelbrot(
    tile_width: usize,
    tile_height: usize,
    canvas_width: usize,
    canvas_height: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    tile_left: f64,
    tile_top: f64,
    mid_x: f64,
    mid_y: f64,
    zoom: f64,
    ratio: f64,
    r_factor: f64,
    g_factor: f64,
    b_factor: f64,
    power: i32,
    grayscale: f64,
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
        zoom,
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
        .into_iter()
        .map(|index| {
            let x = index % tile_width;
            let y = index / tile_width;

            let escape_iteration = escape::get_escape_iteration(x, y, &params);

            if grayscale != 0.0 {
                coloring::shade(
                    escape_iteration,
                    max_iterations,
                    full_max_iterations,
                    grayscale,
                )
            } else {
                coloring::hue(
                    escape_iteration,
                    max_iterations,
                    full_max_iterations,
                    r_factor,
                    g_factor,
                    b_factor,
                )
            }
        })
        .flatten()
        .collect()
}
