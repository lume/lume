/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    var SpecManager = {};
    var zeroZero = [0,0];

    SpecManager.merge = function merge(spec, parentSpec){
        var mergedSpec;

        if (typeof spec == 'number') {

            var transform = parentSpec.transform || Transform.identity;
            var align = parentSpec.align || zeroZero;
            var nextSizeTransform = parentSpec.nextSizeTransform || transform;

            if (align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                var shift = (nextSizeTransform) ? _vecInContext(alignAdjust, nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            mergedSpec = {
                transform : transform,
                opacity : parentSpec.opacity,
                origin : parentSpec.origin,
                size : parentSpec.size
            };

        } else if (spec instanceof Array){

            var mergedSpec = [];
            for (var i = 0; i < spec.length; i++)
                mergedSpec[i] = merge(spec[i], parentSpec);

        } else {

            var spec = SpecManager.flatten(spec);

            var parentSize = parentSpec.size;
            var parentOpacity = parentSpec.opacity || 1;
            var parentTransform = parentSpec.transform || Transform.identity;

            var origin = spec.origin;
            var align = spec.align;
            var size = SpecManager.getSize(spec, parentSize);

            var opacity = (spec.opacity !== undefined)
                ? parentOpacity * spec.opacity
                : parentOpacity;

            var transform = (spec.transform)
                ? Transform.multiply(parentTransform, spec.transform)
                : parentTransform;

            var nextSizeTransform = (spec.origin)
                ? parentTransform
                : parentSpec.nextSizeTransform || parentTransform;

            if (spec.margins)
                transform = Transform.moveThen([spec.margins[3] || 0, spec.margins[0], 0], transform);

            if (spec.size)
                nextSizeTransform = parentTransform;

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

        }

        return mergedSpec;
    };

    SpecManager.flatten = function flatten(spec){
        var flattenedSpec;

        if (spec instanceof Array){
            flattenedSpec = [];
            for (var i = 0; i < spec.length; i++)
                flattenedSpec[i] = flatten(spec[i]);
        }
        else if (!spec.target) flattenedSpec = spec;
        else flattenedSpec = merge(spec.target, spec);

        return flattenedSpec;
    };

    SpecManager.getSize = function flatten(spec, parentSize){
        var size = spec.size || [parentSize[0], parentSize[1]];

        if (spec.size) {
            if (spec.size[0] === undefined) size[0] = parentSize[0];
            if (spec.size[1] === undefined) size[1] = parentSize[1];
        }

        if (spec.margins){
            size[0] = parentSize[0] - ((spec.margins[1] || 0) + (spec.margins[3] || 0));
            size[1] = parentSize[1] - (spec.margins[0] + (spec.margins[2] || 0));
        }

        if (spec.proportions) {
            if (spec.proportions[0] !== undefined) size[0] *= spec.proportions[0];
            if (spec.proportions[1] !== undefined) size[1] *= spec.proportions[1];
        }

        return size;
    };

    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    module.exports = SpecManager;
});
