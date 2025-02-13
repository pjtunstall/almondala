const FULL_MAX_ITERATIONS: f64 = 1024.0;

pub fn color(escape_iteration: usize, max_iterations: usize) -> [u8; 4] {
    if escape_iteration == max_iterations {
        return [0, 0, 0, 255];
    }

    let hue = escape_iteration as f64 / FULL_MAX_ITERATIONS;
    let r = ((hue * 23.0 * std::f64::consts::TAU).sin() * 128.0 + 128.0).clamp(0.0, 255.0) as u8;
    let g =
        ((hue * 17.0 * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0).clamp(0.0, 255.0) as u8;
    let b =
        ((hue * 17.0 * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0).clamp(0.0, 255.0) as u8;

    [r, g, b, 255]
}

pub fn shade(escape_iteration: usize, max_iterations: usize) -> [u8; 4] {
    if escape_iteration == max_iterations {
        return [0, 0, 0, 255];
    }

    let fraction = escape_iteration as f64 / FULL_MAX_ITERATIONS;
    let shade =
        ((fraction * 23.0 * std::f64::consts::TAU).sin() * 128.0 + 128.0).clamp(0.0, 255.0) as u8;

    [shade, shade, shade, 255]
}
