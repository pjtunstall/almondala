# Experimental branch: lines

This branch contains experimental work on a progressive rendering technique: to show the even columns first while the odd columns are being calculated. It's not complete or deployed.

To see the fully functional and deployed version of this project, visit the [main branch](https://github.com/pjtunstall/almondala).

The Rust is doing what it's supposed to, but it hasn't come together with the JS yet. There's probably interference between this approach and another: the initial calculation with a lower maximum number of iterations. I should remove that other technique while experimenting with the lines. There also seems to be some quirk whereby the two updates to the canvas (odd and even) are getting batched together, so that only the final result is shown--usually ...

Note that this branch derived from offscreen, hence the fast and slow canvases, representing the two passes with different maximum iteration amounts. That could be simplified to one canvas so as to better see what's going on here.
