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
        var flattenedSpec;

        if (typeof spec === 'number'){
            var transform = parentSpec.transform || Transform.identity;
            var align = parentSpec.align || _zeroZero;

            if (align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                // transform is relative to origin defined by last size context's transform and its alignment
                var shift = (parentSpec.nextSizeTransform) ? _vecInContext(alignAdjust, parentSpec.nextSizeTransform) : alignAdjust;
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

            results.push(flattenedSpec);
        }
        else if (spec instanceof Array){
            flattenedSpec = [];
            for (var i = 0; i < spec.length; i++) {
                flattenedSpec[i] = flatten(spec[i], parentSpec, results);
            }
        }
        else if (spec instanceof Object) {
            var opacity = (spec.opacity !== undefined)
                ? parentSpec.opacity * spec.opacity
                : parentSpec.opacity;

            var transform = (spec.transform)
                ? Transform.multiply(parentSpec.transform || Transform.identity, spec.transform)
                : parentSpec.transform || Transform.identity;

            var nextSizeTransform = (spec.origin)
                ? parentSpec.transform
                : parentSpec.nextSizeTransform;

            var origin = spec.origin;

            var align = spec.align;
            if (align){
                var parentSize = parentSpec.size;
                if (parentSize && align[0] || align[1]) {
                    var shift = _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], parentSpec.nextSizeTransform);
                    transform = Transform.thenMove(transform, shift);
                    align = null;
                }
            }

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

                if (origin && origin[0] && origin[1])
                    transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);

                origin = null;
                nextSizeTransform = parentSpec.transform;
            }
            else size = parentSpec.size;

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
                flattenedSpec = flatten(spec.target, flattenedSpec, results);
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
