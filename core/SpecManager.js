/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    var SpecManager = {};

    SpecManager.merge = function merge(spec, parentSpec, entityData){
        var mergedSpec;

        if (typeof spec == 'number') {

            var transform = parentSpec.transform || Transform.identity;
            var align = parentSpec.align || null;

            if (align && (align[0] || align[1])) {
                var nextSizeTransform = parentSpec.nextSizeTransform || transform;
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                var shift = (nextSizeTransform) ? _vecInContext(alignAdjust, nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            mergedSpec = {
                transform : transform,
                opacity : parentSpec.opacity || null,
                origin : parentSpec.origin || null,
                size : parentSpec.size || null
            };

            if (entityData) entityData[spec] = mergedSpec;

        } else if (spec instanceof Array){

            var mergedSpec = [];
            for (var i = 0; i < spec.length; i++)
                mergedSpec[i] = SpecManager.merge(spec[i], parentSpec, entityData);

        }
        else if (spec instanceof Object){
            var parentSize = parentSpec.size;
            var parentOpacity = parentSpec.opacity || 1;
            var parentTransform = parentSpec.transform || Transform.identity;

            var origin = spec.origin || null;
            var align = spec.align || null;
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

            if (spec.target !== undefined)
                mergedSpec = SpecManager.merge(spec.target, mergedSpec, entityData);

        }
        else spec = null;

        return mergedSpec;
    };

    // TODO: pass in this._entityIds here and append to them!
    SpecManager.flatten = function flatten(spec, entityData){
        var flattenedSpec;

        if (spec instanceof Array){
            flattenedSpec = [];
            for (var i = 0; i < spec.length; i++)
                flattenedSpec[i] = SpecManager.flatten(spec[i], entityData);
        }
        else if (spec instanceof Object && spec.target instanceof Object)
            flattenedSpec = SpecManager.merge(spec.target, spec, entityData);
        else
            flattenedSpec = spec;

        return flattenedSpec;
    };

    SpecManager.walk = function walk(spec, reduce, apply){
        if (spec instanceof Array){
            for (var i = 0; i < spec.length; i++)
                SpecManager.walk(spec[i], reduce, apply);
        }
        else if (spec instanceof Object && spec.target !== undefined){
            var reduced = reduce(spec.target, spec);
            SpecManager.walk(reduced);
        }
        else apply(spec);
    };

//    SpecManager.flatten = function(spec){
//        var results = [];
//
//        walk(spec, SpecManager.reduce, function(leaf){
//            results.push(leaf);
//        });
//
//        return results;
//    };
//
//    SpecManager.getEntities = function(spec){
//        var entities = {};
//        walk(spec, SpecManager.reduce, function(leaf){
//            if (typeof leaf == 'number')
//                entities[leaf]
//        })
//    };

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
