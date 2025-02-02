use num::complex::Complex;

pub fn get_escape_iteration(
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
