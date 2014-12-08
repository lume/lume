/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    var SpecParser = {};
    var _zeroZero = [0, 0];

    SpecParser.parse = function parse(spec, parentContext){
        var result = {};
        var sizeContext = Transform.identity;
        return _parse(spec, parentContext, sizeContext, result);
    };

    function _parse(spec, parentContext, sizeContext, result){
        var id;
        var target;
        var transform;
        var opacity;
        var origin;
        var align;
        var size;
        var sizeContext = sizeContext || Transform.identity;

        if (typeof spec === 'number') {
            id = spec;
            transform = parentContext.transform;
            align = parentContext.align || _zeroZero;
            if (parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
            }
            result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _zeroZero,
                align: parentContext.align || _zeroZero,
                size: parentContext.size
            };
        }
        else if (!spec) { // placed here so 0 will be caught earlier
            return;
        }
        else if (spec instanceof Array) {
            for (var i = 0; i < spec.length; i++) {
                _parse(spec[i], parentContext, sizeContext, result);
            }
        }
        else {
            target = spec.target;
            transform = parentContext.transform;
            opacity = parentContext.opacity;
            origin = parentContext.origin;
            align = parentContext.align;
            size = parentContext.size;
            var nextSizeContext = sizeContext;

            if (spec.opacity !== undefined) opacity = parentContext.opacity * spec.opacity;

            if (spec.transform) transform = Transform.multiply(parentContext.transform, spec.transform);

            if (spec.origin) {
                origin = spec.origin;
                nextSizeContext = parentContext.transform;
            }

            if (spec.align) align = spec.align;

            if (spec.size || spec.proportions) {
                var parentSize = size;
                size = [size[0], size[1]];

                if (spec.size) {
                    if (spec.size[0] !== undefined) size[0] = spec.size[0];
                    if (spec.size[1] !== undefined) size[1] = spec.size[1];
                }

                if (spec.proportions) {
                    if (spec.proportions[0] !== undefined) size[0] = size[0] * spec.proportions[0];
                    if (spec.proportions[1] !== undefined) size[1] = size[1] * spec.proportions[1];
                }

                if (parentSize) {
                    if (align && (align[0] || align[1])) transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext));
                    if (origin && (origin[0] || origin[1])) transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                }

                nextSizeContext = parentContext.transform;
                origin = null;
                align = null;
            }

            _parse(target, {
                transform: transform,
                opacity: opacity,
                origin: origin,
                align: align,
                size: size
            }, nextSizeContext, result);
        }

        return result;
    }

    // Multiply matrix M by vector v
    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    module.exports = SpecParser;
});
