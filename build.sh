sass src/styles:public/styles --style=compressed
esbuild src/scripts/main.ts --bundle --minify --sourcemap --outdir=public/scripts
