use proc_macro::TokenStream;
use quote::quote;

#[proc_macro]
pub fn generate_color_tables(_input: TokenStream) -> TokenStream {
    const FULL_MAX_ITERATIONS: usize = 1024;

    fn color(escape_iteration: usize) -> [u8; 4] {
        let hue = escape_iteration as f64 / FULL_MAX_ITERATIONS as f64;
        let r =
            ((hue * 23.0 * std::f64::consts::TAU).sin() * 128.0 + 128.0).clamp(0.0, 255.0) as u8;
        let g = ((hue * 17.0 * std::f64::consts::TAU + 2.0).sin() * 128.0 + 128.0).clamp(0.0, 255.0)
            as u8;
        let b = ((hue * 17.0 * std::f64::consts::TAU + 3.0).sin() * 128.0 + 128.0).clamp(0.0, 255.0)
            as u8;
        [r, g, b, 255]
    }

    fn shade(escape_iteration: usize) -> [u8; 4] {
        let fraction = escape_iteration as f64 / FULL_MAX_ITERATIONS as f64;
        let shade = ((fraction * 23.0 * std::f64::consts::TAU).sin() * 128.0 + 128.0)
            .clamp(0.0, 255.0) as u8;
        [shade, shade, shade, 255]
    }

    let colors: Vec<_> = (0..FULL_MAX_ITERATIONS).map(color).collect();
    let shades: Vec<_> = (0..FULL_MAX_ITERATIONS).map(shade).collect();

    let colors_tokens = colors.iter().map(|c| {
        let [r, g, b, a] = *c;
        quote! { [#r, #g, #b, #a] }
    });
    let shades_tokens = shades.iter().map(|s| {
        let [r, g, b, a] = *s;
        quote! { [#r, #g, #b, #a] }
    });

    let expanded = quote! {
        pub const COLORS: [[u8; 4]; #FULL_MAX_ITERATIONS] = [#(#colors_tokens),*];
        pub const SHADES: [[u8; 4]; #FULL_MAX_ITERATIONS] = [#(#shades_tokens),*];
    };

    TokenStream::from(expanded)
}
