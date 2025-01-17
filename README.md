Experimental branch: ts-oo (TypeScript object-oriented)

This branch contains experimental work on a modular, more object-oriented iteration of the first TypeScript version.

To see the fully functional and deployed version of this project, visit the [main branch](https://github.com/pjtunstall/almondala).

To try out this branch locally, you can follow the steps described in the `main` README. Although the commands you have to enter are the same, it might be worth noting that that the automated build process contains one extra step:

"This will build the WebAssembly file `almondala_bg.wasm` to the pkg directory and copy it to the `public/wasm` directory along with its associated JavaScipt glue code `almondala.js` and the two TypeScript type-declaration files, `amondala.d.ts` and `almondala_bg.wasm.d.ts`. It concludes by correcting the import path for the glue from relative to the TypeScript source, as required by the TypeScript compiler, to relative to the actual compiled JavaScript."
