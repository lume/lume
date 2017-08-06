npm run transpile $1
babel tmp --source-maps --out-dir . --plugins=transform-es2015-modules-commonjs,add-module-exports $1
