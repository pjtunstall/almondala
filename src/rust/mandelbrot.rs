use rayon::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_mandelbrot_shared(
    buffer_ptr: *mut u8,
    width: usize,
    height: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    mid_x: f64,
    mid_y: f64,
    zoom: f64,
    r_factor: f64,
    g_factor: f64,
    b_factor: f64,
) {
    let buffer = unsafe { std::slice::from_raw_parts_mut(buffer_ptr, width * height * 4) };

    buffer
        .par_chunks_mut(4)
        .enumerate()
        .for_each(|(index, pixel)| {
            let x = index % width;
            let y = index / width;

            let cx = zoom * (3.5 * x as f64 / width as f64 - 2.5) - mid_x;
            let cy = zoom * (2.0 * y as f64 / height as f64 - 1.0) - mid_y;

            let mut zx = 0.0;
            let mut zy = 0.0;
            let mut iteration = 0;

            while zx * zx + zy * zy <= 4.0 && iteration < max_iterations {
                let temp = zx * zx - zy * zy + cx;
                zy = 2.0 * zx * zy + cy;
                zx = temp;
                iteration += 1;
            }

            let color = calculate_color(
                iteration,
                max_iterations,
                full_max_iterations,
                r_factor,
                g_factor,
                b_factor,
            );

            pixel.copy_from_slice(&color);
        });
}

fn calculate_color(
    iteration: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    r_factor: f64,
    g_factor: f64,
    b_factor: f64,
) -> [u8; 4] {
    if iteration >= max_iterations {
        return [0, 0, 0, 255];
    }

    let hue = iteration as f64 / full_max_iterations as f64;
    let r = (hue * r_factor * std::f64::consts::TAU).sin() * 128.0 + 128.0;
    let b = (hue * g_factor * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0;
    let g = (hue * b_factor * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0;

    [r as u8, g as u8, b as u8, 255]
}
