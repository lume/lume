/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    function compose(spec, parentSize){
        var size = new Array(2);

        if (spec.size) {
            // inheritance
            if (spec.size[0] === undefined) size[0] = parentSize[0];
            if (spec.size[1] === undefined) size[1] = parentSize[1];

            // override
            if (typeof spec.size[0] === 'number') size[0] = spec.size[0];
            if (typeof spec.size[1] === 'number') size[1] = spec.size[1];

            if (spec.size[0] === true) size[0] = true;
            if (spec.size[1] === true) size[1] = true;
        }
        else {
            size[0] = parentSize[0];
            size[1] = parentSize[1];
        }

        //TODO: what is parentSize isn't numeric? Compose margin/proportions?
        if (spec.margins){
            size[0] = parentSize[0] - (2 * spec.margins[0]);
            size[1] = parentSize[1] - (2 * spec.margins[1]);
        }

        if (spec.proportions) {
            if (spec.proportions[0] !== undefined) size[0] *= spec.proportions[0];
            if (spec.proportions[1] !== undefined) size[1] *= spec.proportions[1];
        }

        return size;
    }

    module.exports = compose;
});
