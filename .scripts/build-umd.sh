./.scripts/transpile.sh $1

# the plugin add-module-exports must come before transform-es2015-modules-umd in this case
babel esmodule --source-maps --out-dir . --plugins=add-module-exports,transform-es2015-modules-umd $1
