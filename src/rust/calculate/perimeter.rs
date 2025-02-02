use super::escape;

pub fn is_perimeter_all_black(
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
    let top = check_edge(
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
        0,
        0,
        tile_width - 1,
        0,
    );
    let bottom = check_edge(
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
        0,
        tile_height - 1,
        tile_width - 1,
        tile_height - 1,
    );
    let left = check_edge(
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
        0,
        0,
        0,
        tile_height - 1,
    );
    let right = check_edge(
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
        tile_width - 1,
        0,
        tile_width - 1,
        tile_height - 1,
    );

    top && bottom && left && right
}

fn check_edge(
    max_iterations: usize,
    canvas_width: usize,
    canvas_height: usize,
    ratio: f64,
    tile_left: f64,
    tile_top: f64,
    mid_x: f64,
    mid_y: f64,
    zoom: f64,
    power: i32,
    start_x: usize,
    start_y: usize,
    end_x: usize,
    end_y: usize,
) -> bool {
    for x in start_x..=end_x {
        for y in start_y..=end_y {
            if escape::get_escape_iteration(
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
    }

    true
}
