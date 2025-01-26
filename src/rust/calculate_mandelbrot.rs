use num::complex::Complex;
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
    power: i32,
    grayscale: f64,
) -> Vec<u8> {
    (0..width * height)
        .into_iter()
        .map(|index| {
            let x = index % width;
            let y = index / width;

            let cx = ratio * (x as f64 / width as f64 - 0.5) * 3.0 * zoom + mid_x;
            let cy = -(y as f64 / height as f64 - 0.5) * 3.0 * zoom + mid_y;

            let c = Complex::new(cx, cy);
            let mut z = Complex::new(0.0, 0.0);

            let mut escape_iteration = 0;

            while escape_iteration < max_iterations && z.norm_sqr() < 4.0 {
                z = z.powi(power) + c;
                escape_iteration += 1;
            }

            if grayscale != 0.0 {
                shade(
                    escape_iteration,
                    max_iterations,
                    full_max_iterations,
                    grayscale,
                )
            } else {
                hue(
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

fn hue(
    escape_iteration: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    r_factor: f64,
    g_factor: f64,
    b_factor: f64,
) -> Vec<u8> {
    if escape_iteration == max_iterations {
        return vec![0, 0, 0, 255];
    }

    let hue = escape_iteration as f64 / full_max_iterations as f64;
    let r =
        ((hue * r_factor * std::f64::consts::TAU).sin() * 128.0 + 128.0).clamp(0.0, 255.0) as u8;
    let b = ((hue * g_factor * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0).clamp(0.0, 255.0)
        as u8;
    let g = ((hue * b_factor * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0).clamp(0.0, 255.0)
        as u8;

    vec![r, g, b, 255]
}

fn shade(
    escape_iteration: usize,
    max_iterations: usize,
    full_max_iterations: usize,
    grayscale: f64,
) -> Vec<u8> {
    if escape_iteration == max_iterations {
        return vec![0, 0, 0, 255];
    }

    let fraction = escape_iteration as f64 / full_max_iterations as f64;
    let shade = ((fraction * grayscale * std::f64::consts::TAU).sin() * 128.0 + 128.0)
        .clamp(0.0, 255.0) as u8;

    vec![shade, shade, shade, 255]
}
