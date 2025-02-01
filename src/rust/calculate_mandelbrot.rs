use num::complex::Complex;
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
    if is_perimeter_all_black(
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

            let escape_iteration = get_escape_iteration(
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

fn get_escape_iteration(
    x: usize,
    y: usize,
    max_iterations: usize,
    canvas_width: usize,
    canvas_height: usize,
    ratio: f64,
    left: f64,
    top: f64,
    mid_x: f64,
    mid_y: f64,
    zoom: f64,
    power: i32,
) -> usize {
    // Calculate the absolute pixel position in the full canvas
    let absolute_x = left + (x as f64);
    let absolute_y = top + (y as f64);

    // Use the absolute position to calculate the complex coordinates
    let cx = mid_x + ratio * (absolute_x as f64 / canvas_width as f64 - 0.5) * 3.0 * zoom;
    let cy = mid_y - (absolute_y as f64 / canvas_height as f64 - 0.5) * 3.0 * zoom;

    let c = Complex::new(cx, cy);
    let mut z = Complex::new(0.0, 0.0);

    let mut escape_iteration = 0;

    while escape_iteration < max_iterations && z.norm_sqr() < 4.0 {
        z = z.powi(power) + c;
        escape_iteration += 1;
    }

    escape_iteration
}

fn is_perimeter_all_black(
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
) -> bool {
    for x in 0..tile_width {
        let y: usize = 0;
        if get_escape_iteration(
            x,
            y,
            max_iterations,
            canvas_width,
            canvas_height,
            ratio,
            tile_left,
            tile_top,
            mid_x,
            mid_y,
            zoom,
            power,
        ) < max_iterations
        {
            return false;
        }
    }

    for y in 0..tile_height {
        let x: usize = 0;
        if get_escape_iteration(
            x,
            y,
            max_iterations,
            canvas_width,
            canvas_height,
            ratio,
            tile_left,
            tile_top,
            mid_x,
            mid_y,
            zoom,
            power,
        ) < max_iterations
        {
            return false;
        }
    }

    for x in 0..tile_width {
        let y: usize = tile_height - 1;
        if get_escape_iteration(
            x,
            y,
            max_iterations,
            canvas_width,
            canvas_height,
            ratio,
            tile_left,
            tile_top,
            mid_x,
            mid_y,
            zoom,
            power,
        ) < max_iterations
        {
            return false;
        }
    }

    for y in 0..tile_height {
        let x: usize = tile_width - 1;
        if get_escape_iteration(
            x,
            y,
            max_iterations,
            canvas_width,
            canvas_height,
            ratio,
            tile_left,
            tile_top,
            mid_x,
            mid_y,
            zoom,
            power,
        ) < max_iterations
        {
            return false;
        }
    }

    true
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
    let r = (r_factor * ((hue * 23.0 * std::f64::consts::TAU).sin() * 128.0 + 128.0))
        .clamp(0.0, 255.0) as u8;
    let g = (g_factor * ((hue * 17.0 * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0))
        .clamp(0.0, 255.0) as u8;
    let b = (b_factor * ((hue * 17.0 * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0))
        .clamp(0.0, 255.0) as u8;

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
