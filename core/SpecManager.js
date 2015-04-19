/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    var SpecManager = {};

    SpecManager.merge = function merge(spec, parentSpec){
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
            : parentSpec.nextSizeTransform || Transform.identity;

        if (spec.margins)
            transform = Transform.moveThen([spec.margins[3] || 0, spec.margins[0], 0], transform);

        if (parentSize && align && (align[0] || align[1])) {
            var shift = _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], nextSizeTransform);
            transform = Transform.thenMove(transform, shift);
            align = null;
        }

        return {
            transform : transform,
            opacity : opacity,
            origin : origin,
            align : align,
            size : size,
            nextSizeTransform : nextSizeTransform
        };
    };

    SpecManager.flatten = function flatten(spec){
        if (!spec.target) return spec;
        else return merge(spec.target, spec);
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
