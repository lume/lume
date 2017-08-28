# Here we use webpack to build a UMD (Universal Module Definition) module that
# will put the exports of your package entrypoint onto the the global scope
# (`window` in a browser, for example)

# Choose the name of the global symbol your project will define (for example,
# the variable name that will be assigned onto `window` when this runs in a
# browser).
package_name='infamous'

webpack \
    --display-optimization-bailout \
    --progress \
    --colors \
    --output-library-target umd \
    src/index.js \
    global.js \
    --output-library $package_name $1

# TODO FIXME: When we enable Rollup instead of Webpack we get this error:
#
# 'default' is not exported by 'node_modules/core-js/library/modules/es6.object.to-string.js'
#
# which seems to hint that some module is compiled by Babel (because it imports
# core-js stuff). In commit 1e241eb3 I mentioned that the problem might be with
# DOMMatrix.
#
# Using the namedExports option (for Buble) with "default" as one of the
# possible named exports (in rollup.config.js) doesn't work. See the
# namedExports definition in rollup.config.js.
#
# Unfortunately, I didn't write how to reproduce. I think maybe despite the
# error the bundle might be made and running it will show the runtime error...?
#rollup -c
