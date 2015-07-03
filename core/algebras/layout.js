/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');

    function compose(spec, parentSpec, size){
        var mergedSpec;

        if (typeof spec == 'number') {

            var transform = parentSpec.transform || Transform.identity;
            var align = parentSpec.align || null;
            var opacity = (parentSpec.opacity !== undefined) ? parentSpec.opacity : 1;

            if (align && (align[0] || align[1])) {
                var nextSizeTransform = parentSpec.nextSizeTransform || transform;
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                var shift = (nextSizeTransform) ? _vecInContext(alignAdjust, nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            mergedSpec = {
                transform : transform,
                opacity : opacity,
                origin : parentSpec.origin || null,
                size : parentSpec.size || null
            };

        } else if (spec instanceof Array){

            var mergedSpec = [];
            for (var i = 0; i < spec.length; i++)
                mergedSpec[i] = compose.merge(spec[i], parentSpec);

        }
        else if (spec instanceof Object){
            var parentSize = parentSpec.size;
            var parentOpacity = (parentSpec.opacity !== undefined) ? parentSpec.opacity : 1;
            var parentTransform = parentSpec.transform || Transform.identity;

            var origin = spec.origin || null;
            var align = spec.align || null;

            var opacity = (spec.opacity !== undefined)
                ? parentOpacity * spec.opacity
                : parentOpacity;

            var transform = (spec.transform)
                ? Transform.multiply(parentTransform, spec.transform)
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

            if (parentSize && align && (align[0] || align[1])) {
                var shift = _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], nextSizeTransform);
                transform = Transform.thenMove(transform, shift);
                align = null;
            }

            mergedSpec = {
                transform : transform,
                opacity : opacity,
                origin : origin,
                align : align,
                size : size,
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
