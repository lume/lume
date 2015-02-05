/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    var SpecParser = {};
    var _zeroZero = [0,0];

    SpecParser.flatten = function flatten(spec, parentSpec, results){
        if (typeof spec === 'number'){
            if (!parentSpec) return {
                transform : Transform.identity,
                opacity : 1,
                origin : _zeroZero,
                size : null
            };

            var transform = parentSpec.transform || Transform.identity;
            var align = parentSpec.align || _zeroZero;

            if (parentSpec.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                // transform is relative to origin defined by last size context's transform and its alignment
                var shift = (parentSpec.nextSizeTransform) ? _vecInContext(alignAdjust, parentSpec.nextSizeTransform) : alignAdjust;
                transform = Transform.thenMove(transform, shift);
            }

            results.push({
                transform : transform,
                opacity : parentSpec.opacity,
                origin : parentSpec.origin || _zeroZero,
                size : parentSpec.size,
                target : spec
            });
        }
        else if (spec instanceof Array){
            for (var i = 0; i < spec.length; i++)
                SpecParser.flatten(spec[i], parentSpec, results);
        }
        else if (spec instanceof Object){
            var opacity = (spec.opacity !== undefined)
                ? parentSpec.opacity * spec.opacity
                : parentSpec.opacity;

            var transform = (spec.transform)
                ? Transform.multiply(parentSpec.transform, spec.transform)
                : parentSpec.transform;

            var align = (spec.align)
                ? spec.align
                : parentSpec.align;

            var origin = (spec.origin)
                ? spec.origin
                : parentSpec.origin;

            var nextSizeTransform = (spec.origin)
                ? parentSpec.transform
                : parentSpec.nextSizeTransform;

            var size;
            if (spec.size || spec.proportions) {
                var parentSize = parentSpec.size;
                size = [parentSize[0], parentSize[1]];

                if (spec.size) {
                    if (spec.size[0] !== undefined) size[0] = spec.size[0];
                    if (spec.size[1] !== undefined) size[1] = spec.size[1];
                }

                if (spec.proportions) {
                    if (spec.proportions[0] !== undefined) size[0] *= spec.proportions[0];
                    if (spec.proportions[1] !== undefined) size[1] *= spec.proportions[1];
                }

                if (align && (align[0] || align[1]))
                    transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], parentSpec.transform));

                if (origin && (origin[0] || origin[1]))
                    transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);

                nextSizeTransform = parentSpec.transform;
//                origin = null;
//                align = null;
            }
            else size = parentSpec.size;

            spec.transform = transform;
            spec.opacity = opacity;
            spec.origin = origin;
            spec.align = align;
            spec.size = size;
            spec.nextSizeTransform = nextSizeTransform;

            // iterate if spec is nested
            if (spec.target !== undefined)
                SpecParser.flatten(spec.target, spec, results)

        }

        return results;
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
