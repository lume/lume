./.scripts/transpile.sh $1
babel tmp --source-maps --out-dir . --plugins=transform-es2015-modules-amd $1
