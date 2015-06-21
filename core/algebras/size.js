/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    function compose(sizeSpec, parentSize){
        var size = new Array(2);

        if (sizeSpec.size) {
            // inheritance
            if (sizeSpec.size[0] === false) size[0] = parentSize[0];
            if (sizeSpec.size[1] === false) size[1] = parentSize[1];

            // override
            if (typeof sizeSpec.size[0] === 'number') size[0] = sizeSpec.size[0];
            if (typeof sizeSpec.size[1] === 'number') size[1] = sizeSpec.size[1];

            if (sizeSpec.size[0] === true) size[0] = true;
            if (sizeSpec.size[1] === true) size[1] = true;
        }
        else {
            size[0] = parentSize[0];
            size[1] = parentSize[1];
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

        return size;
    }

    module.exports = compose;
});
