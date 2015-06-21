/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    function compose(sizeSpec, parentSizeSpec){
        var parentSize = parentSizeSpec.size;

        var size = (sizeSpec.size)
            ? [sizeSpec.size[0], sizeSpec.size[1]]
            : [parentSize[0], parentSize[1]];

        if (sizeSpec.size) {
            if (sizeSpec.size[0] === undefined) size[0] = parentSize[0];
            if (sizeSpec.size[1] === undefined) size[1] = parentSize[1];

            if (sizeSpec.size[0] === true) size[0] = true;
            if (sizeSpec.size[1] === true) size[1] = true;
        }

        //TODO: what is parentSize isn't numeric? Compose margin/proportions?
        if (sizeSpec.margins){
            size[0] = parentSize[0] - (2 * sizeSpec.margins[0]);
            size[1] = parentSize[1] - (2 * sizeSpec.margins[1]);
        }

        if (sizeSpec.proportions) {
            if (sizeSpec.proportions[0] !== undefined) size[0] *= sizeSpec.proportions[0];
            if (sizeSpec.proportions[1] !== undefined) size[1] *= sizeSpec.proportions[1];
        }

        return {
            size : size,
            margins : null,
            proportions : null
        };
    }

    module.exports = compose;
});
