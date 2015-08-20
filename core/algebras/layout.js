/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('samsara/core/Transform');

    var DEFAULT = {
        OPACITY : 1,
        TRANSFORM : Transform.identity,
        ORIGIN : null,
        ALIGN : null
    };

    function compose(spec, parentSpec, size){
        var mergedSpec;

        if (typeof spec == 'number') {

            var transform = parentSpec.transform || DEFAULT.TRANSFORM;
            var align = parentSpec.align || DEFAULT.ALIGN;
            var opacity = (parentSpec.opacity !== undefined) ? parentSpec.opacity : DEFAULT.OPACITY;

            if (align && (align[0] || align[1])) {
                var nextSizeTransform = parentSpec.nextSizeTransform || transform;
                var alignAdjust = [align[0] * size[0], align[1] * size[1], 0];
                var shift = (nextSizeTransform) ? _vecInContext(alignAdjust, nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            mergedSpec = {
                transform : transform,
                opacity : opacity,
                origin : parentSpec.origin || DEFAULT.ORIGIN
            };

        } else if (spec instanceof Array){
            var mergedSpec = [];
            for (var i = 0; i < spec.length; i++)
                mergedSpec[i] = compose.merge(spec[i], parentSpec);
        }
        else if (spec instanceof Object){
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
                transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                origin = null;
            }

            if (size && align && (align[0] || align[1])) {
                var shift = _vecInContext([align[0] * size[0], align[1] * size[1], 0], nextSizeTransform);
                transform = Transform.thenMove(transform, shift);
                align = null;
            }

            mergedSpec = {
                transform : transform,
                opacity : opacity,
                origin : origin,
                align : align,
                nextSizeTransform : nextSizeTransform
            };

            if (spec.target !== undefined)
                mergedSpec = compose(spec.target, mergedSpec);
        }

        return mergedSpec;
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
