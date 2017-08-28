./.scripts/transpile.sh $1
babel tmp --source-maps --out-dir . --plugins=add-module-exports,transform-es2015-modules-umd $1
