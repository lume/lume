/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    function compose(spec, parentLayoutSpec, sizeSpec){
        var mergedSpec;

        if (typeof spec == 'number') {

            var transform = parentLayoutSpec.transform || Transform.identity;
            var align = parentLayoutSpec.align || null;
            var opacity = (parentLayoutSpec.opacity !== undefined) ? parentLayoutSpec.opacity : 1;

            if (align && (align[0] || align[1])) {
                var nextSizeTransform = parentLayoutSpec.nextSizeTransform || transform;
                var alignAdjust = [align[0] * parentLayoutSpec.size[0], align[1] * parentLayoutSpec.size[1], 0];
                var shift = (nextSizeTransform) ? _vecInContext(alignAdjust, nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            mergedSpec = {
                transform : transform,
                opacity : opacity,
                origin : parentLayoutSpec.origin || null,
                size : parentLayoutSpec.size || null
            };

        } else if (spec instanceof Array){

            var mergedSpec = [];
            for (var i = 0; i < spec.length; i++)
                mergedSpec[i] = compose.merge(spec[i], parentLayoutSpec);

        }
        else if (spec instanceof Object){
            var size = sizeSpec.size;
            var parentSize = parentLayoutSpec.size;
            var parentOpacity = (parentLayoutSpec.opacity !== undefined) ? parentLayoutSpec.opacity : 1;
            var parentTransform = parentLayoutSpec.transform || Transform.identity;

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
                : parentLayoutSpec.nextSizeTransform || parentTransform;

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
        else spec = null;

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
