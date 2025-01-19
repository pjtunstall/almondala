use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_mandelbrot(
    width: usize,
    height: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    mid_x: f64,
    mid_y: f64,
    zoom: f64,
    ratio: f64,
    r_factor: f64,
    g_factor: f64,
    b_factor: f64,
) -> Vec<u8> {
    (0..width * height)
        .into_iter()
        .map(|index| {
            let x = index % width;
            let y = index / width;

            let cx = ratio * (x as f64 / width as f64 - 0.5) * 3.0 * zoom + mid_x;
            let cy = -(y as f64 / height as f64 - 0.5) * 3.0 * zoom + mid_y;

            let mut zx = 0.0;
            let mut zy = 0.0;
            let mut iteration = 0;

            while zx * zx + zy * zy <= 4.0 && iteration < max_iterations {
                let temp = zx * zx - zy * zy + cx;
                zy = 2.0 * zx * zy + cy;
                zx = temp;
                iteration += 1;
            }

            hue(
                iteration,
                max_iterations,
                full_max_iterations,
                r_factor,
                g_factor,
                b_factor,
            )
        })
        .flatten()
        .collect()
}

fn hue(
    iteration: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    r_factor: f64,
    g_factor: f64,
    b_factor: f64,
) -> Vec<u8> {
    if iteration >= max_iterations {
        return vec![0, 0, 0, 255];
    }

    let hue = iteration as f64 / full_max_iterations as f64;
    let r = (hue * r_factor * std::f64::consts::TAU).sin() * 128.0 + 128.0;
    let b = (hue * g_factor * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0;
    let g = (hue * b_factor * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0;

    vec![r as u8, g as u8, b as u8, 255]
}
