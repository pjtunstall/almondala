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
    let top = check_top(
        max_iterations,
        tile_width,
        canvas_width,
        canvas_height,
        ratio,
        tile_left,
        tile_top,
        mid_x,
        mid_y,
        zoom,
        power,
    );
    let bottom = check_bottom(
        max_iterations,
        tile_width,
        tile_height,
        canvas_width,
        canvas_height,
        ratio,
        tile_left,
        tile_top,
        mid_x,
        mid_y,
        zoom,
        power,
    );
    let left = check_left(
        max_iterations,
        tile_height,
        canvas_width,
        canvas_height,
        ratio,
        tile_left,
        tile_top,
        mid_x,
        mid_y,
        zoom,
        power,
    );
    let right = check_right(
        max_iterations,
        tile_width,
        tile_height,
        canvas_width,
        canvas_height,
        ratio,
        tile_left,
        tile_top,
        mid_x,
        mid_y,
        zoom,
        power,
    );

    top && bottom && left && right
}

fn check_top(
    max_iterations: usize,
    tile_width: usize,
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

    true
}

fn check_bottom(
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
        let y: usize = tile_height - 1;
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

    true
}

fn check_left(
    max_iterations: usize,
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
    for y in 0..tile_height {
        let x: usize = 0;
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

    true
}

fn check_right(
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
    for y in 0..tile_height {
        let x: usize = tile_width - 1;
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

    true
}
