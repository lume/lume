# XXX: When using Rollup we get this harmless error:
#
# 'default' is not exported by 'node_modules/core-js/library/modules/es6.object.to-string.js'
#
# See https://github.com/rollup/rollup/issues/1408
rollup -c $1
