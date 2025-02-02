mod coloring;
mod escape;
mod perimeter;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_mandelbrot(
    tile_width: usize,
    tile_height: usize,
    cansvas_width: usize,
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
    if perimeter::is_perimeter_all_black(
        tile_width,
        tile_height,
        cansvas_width,
        canvas_height,
        max_iterations,
        tile_left,
        tile_top,
        mid_x,
        mid_y,
        zoom,
        ratio,
        power,
    ) {
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

            let escape_iteration = escape::get_escape_iteration(
                x,
                y,
                max_iterations,
                cansvas_width,
                canvas_height,
                ratio,
                tile_left,
                tile_top,
                mid_x,
                mid_y,
                zoom,
                power,
            );

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
