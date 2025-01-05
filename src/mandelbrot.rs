use rayon::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_mandelbrot(
    width: usize,
    height: usize,
    max_iterations: usize,
    mid_x: f64,
    mid_y: f64,
    zoom: f64,
) -> Vec<u8> {
    (0..width * height)
        .into_par_iter()
        .map(|index| {
            let x = index % width;
            let y = index / width;

            let cx = zoom * (3.5 * x as f64 / width as f64 - 2.5) - mid_x;
            let cy = zoom * (2.0 * y as f64 / height as f64 - 1.0) - mid_y;

            // Exit early for a disc of points known to be inside the main cardioid.
            if (cx + 0.25) * (cx + 0.25) + cy * cy < 0.16 {
                return vec![0, 0, 0, 255];
            }

            let mut zx = 0.0;
            let mut zy = 0.0;
            let mut iteration = 0;

            while zx * zx + zy * zy <= 4.0 && iteration < max_iterations {
                let temp = zx * zx - zy * zy + cx;
                zy = 2.0 * zx * zy + cy;
                zx = temp;
                iteration += 1;
            }

            hue(iteration, max_iterations)
        })
        .flatten()
        .collect()
}

fn hue(iteration: usize, max_iterations: usize) -> Vec<u8> {
    if iteration >= max_iterations {
        return vec![0, 0, 0, 255];
    }

    let hue = iteration as f64 / max_iterations as f64;
    let r = (hue * 23.0 * std::f64::consts::TAU).sin() * 128.0 + 128.0;
    let b = (hue * 17.0 * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0;
    let g = (hue * 17.0 * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0;

    vec![r as u8, g as u8, b as u8, 255]
}
