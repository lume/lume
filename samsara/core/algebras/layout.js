/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../../core/Transform');

    var DEFAULT = {
        OPACITY : 1,
        TRANSFORM : Transform.identity,
        ORIGIN : null,
        ALIGN : null
    };

    /**
     * Defines the rules for composing layout specs: transform, align, origin and opacity.
     *  Transform is multiplied by the parent's transform (matrix multiplication).
     *  Align is a proportional offset relative to the parent size.
     *  Origin is a proportional offset relative to the current size.
     *  Opacity is multiplied by the parent's opacity.
     *
     * @method compose
     * @private
     * @param spec {object}           Object layout spec
     * @param parentSpec {object}     Parent layout spec
     * @param size {Array}            Object size
     * @return {object}               The composed layout spec
     */

    function compose(spec, parentSpec, size){
        var parentOpacity = (parentSpec.opacity !== undefined) ? parentSpec.opacity : DEFAULT.OPACITY;
        var parentTransform = parentSpec.transform || DEFAULT.TRANSFORM;

        var origin = spec.origin || DEFAULT.ORIGIN;
        var align = spec.align || DEFAULT.ALIGN;

        var opacity = (spec.opacity !== undefined)
            ? parentOpacity * spec.opacity
            : parentOpacity;

        var transform = (spec.transform)
            ? Transform.compose(parentTransform, spec.transform)
            : parentTransform;

        var nextSizeTransform = (spec.origin)
            ? parentTransform
            : parentSpec.nextSizeTransform || parentTransform;

        if (spec.size)
            nextSizeTransform = parentTransform;

        if (origin && (origin[0] || origin[1])){
            //TODO: allow origin to propogate when size is non-numeric
            var tx = (typeof size[0] === 'number') ? -origin[0] * size[0] : 0;
            var ty = (typeof size[1] === 'number') ? -origin[1] * size[1] : 0;
            transform = Transform.moveThen([tx, ty, 0], transform);
            origin = null;
        }

        if (size && align && (align[0] || align[1])) {
            var shift = _vecInContext([align[0] * size[0], align[1] * size[1], 0], nextSizeTransform);
            transform = Transform.thenMove(transform, shift);
            align = null;
        }

        return {
            transform : transform,
            opacity : opacity,
            origin : origin,
            align : align,
            nextSizeTransform : nextSizeTransform
        };
    }

    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    module.exports = compose;
});
