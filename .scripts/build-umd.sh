npm run transpile $1
babel src --source-maps --out-dir . --plugins=transform-es2015-modules-umd $1
