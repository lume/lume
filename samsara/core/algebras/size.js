/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {

    /**
     * Defines the rules for composing size specs (size, margin, proportions) into a new size.
     *  A margin array reduces the parent size by an amount specified in pixels.
     *  A proportions array scales the parent size by a provided ratio.
     *  A size array [width, height] can take `true`, `undefined`, or numeric values.
     *      `undefined` takes the parent value
     *      `true` takes the value defined by the DOM
     *      numeric values override parent values
     *
     * @method compose
     * @private
     * @param spec {object}           Object size spec
     * @param parentSize {object}     Parent size
     * @return size {object}          Composed size
     */

    function compose(spec, parentSize){
        if (!spec) return parentSize;

        var size = new Array(2);

        if (spec.size instanceof Function) {
            size = spec.size(parentSize);
        }
        else if (spec.size instanceof Array) {
            // inheritance
            if (spec.size[0] === undefined) size[0] = parentSize[0];
            if (spec.size[1] === undefined) size[1] = parentSize[1];

            // override
            if (typeof spec.size[0] === 'number') size[0] = spec.size[0];
            if (typeof spec.size[1] === 'number') size[1] = spec.size[1];

            if (spec.size[0] === true) size[0] = true;
            if (spec.size[1] === true) size[1] = true;
        }

        if (spec.proportions) {
            if (typeof spec.proportions[0] === 'number') size[0] = spec.proportions[0] * parentSize[0];
            if (typeof spec.proportions[1] === 'number') size[1] = spec.proportions[1] * parentSize[1];
        }

        if (spec.aspectRatio) {
            if (typeof size[0] === 'number') size[1] = spec.aspectRatio * size[0];
            else if (typeof size[1] === 'number') size[0] = spec.aspectRatio * size[1];
        }

        if (size[0] === undefined) size[0] = parentSize[0];
        if (size[1] === undefined) size[1] = parentSize[1];

        if (spec.margins) {
            size[0] -= 2 * spec.margins[0];
            size[1] -= 2 * spec.margins[1];
        }

        return size;
    }

    module.exports = compose;
});
