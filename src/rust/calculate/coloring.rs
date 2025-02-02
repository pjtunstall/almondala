pub fn hue(
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

pub fn shade(
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
