/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    var SpecParser = {};
    var _zeroZero = [0,0];

    SpecParser.flatten = function flatten(spec, parentSpec){
        var flattenedSpec;

        if (typeof spec === 'number'){
            var transform = parentSpec.transform || Transform.identity;
            var align = parentSpec.align || _zeroZero;

            if (align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                // transform is relative to origin defined by last size context's transform and its alignment
                var shift = (nextSizeTransform) ? _vecInContext(alignAdjust, nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            flattenedSpec = {
                transform : transform,
                opacity : parentSpec.opacity,
                origin : parentSpec.origin,
                align : parentSpec.align,
                size : parentSpec.size,
                target : spec
            };

        }
        else if (spec instanceof Array){
            flattenedSpec = [];
            for (var i = 0; i < spec.length; i++) {
                flattenedSpec[i] = flatten(spec[i], parentSpec);
            }
        }
        else if (spec instanceof Object) {
            var parentSize = parentSpec.size;
            var parentOpacity = parentSpec.opacity || 1;
            var parentTransform = parentSpec.transform || Transform.identity;

            var origin = spec.origin;
            var align = spec.align;
            var size = spec.size || [parentSize[0], parentSize[1]];

            var opacity = (spec.opacity !== undefined)
                ? parentOpacity * spec.opacity
                : parentOpacity;

            var transform = (spec.transform)
                ? Transform.multiply(parentTransform, spec.transform)
                : parentTransform;

            var nextSizeTransform = (spec.origin)
                ? parentTransform
                : parentSpec.nextSizeTransform || Transform.identity;

            if (spec.size) {
                if (spec.size[0] === undefined) size[0] = parentSize[0];
                if (spec.size[1] === undefined) size[1] = parentSize[1];
                nextSizeTransform = parentSpec.transform || Transform.identity;
            }

            if (spec.margins){
                size[0] = parentSize[0] - ((spec.margins[1] || 0) + (spec.margins[3] || 0));
                size[1] = parentSize[1] - (spec.margins[0] + (spec.margins[2] || 0));
                transform = Transform.moveThen([spec.margins[3] || 0, spec.margins[0], 0], transform);
            }

            if (spec.proportions) {
                if (spec.proportions[0] !== undefined) size[0] *= spec.proportions[0];
                if (spec.proportions[1] !== undefined) size[1] *= spec.proportions[1];
            }

            if (origin && (origin[0] || origin[1])){
                transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                origin = null;
            }

            if (align){
                if (parentSize && (align[0] || align[1])) {
                    debugger
                    var shift = _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], nextSizeTransform);
                    transform = Transform.thenMove(transform, shift);
                    align = null;
                }
            }

            flattenedSpec = {
                transform : transform,
                opacity : opacity,
                origin : origin,
                align : align,
                size : size,
                nextSizeTransform : nextSizeTransform
            };

            // iterate
            if (spec.target !== undefined)
                flattenedSpec = flatten(spec.target, flattenedSpec);
        }

        return flattenedSpec;
    };

    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    module.exports = SpecParser;
});
