#npm run transpile $1
./.scripts/transpile.sh $1
babel tmp --source-maps --out-dir . --plugins=transform-es2015-modules-commonjs,add-module-exports $1
