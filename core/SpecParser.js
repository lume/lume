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

    var SpecParser = function SpecParser(){
        this.cache = {};
        this.counter = 0;
    };

    var _zeroZero = [0, 0];
    var cachingEnabled = false;

    SpecParser.prototype.reset = function reset(){
        this.counter = 0;
    };

    SpecParser.prototype.parse = function parse(spec, parentContext){
        var result = {};
        var sizeContext = Transform.identity;
        var dirty = false;
        return _parse.call(this, spec, parentContext, sizeContext, result, dirty);
    };

    function _parse(spec, parentContext, transformContext, result, dirty){
        this.counter++;
        var counter = this.counter;

        var id;
        var target;
        var transform;
        var opacity;
        var origin;
        var align;
        var size;

        if (typeof spec === 'number') {
            id = spec;

            transform = parentContext.transform;
            align = parentContext.align || _zeroZero;
            if (parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, transformContext));
            }

            this.cache[counter] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _zeroZero,
                align: parentContext.align || _zeroZero,
                size: parentContext.size
            };

            result[id] = this.cache[counter];
        }
        else if (!spec) { // placed here so 0 will be caught earlier
            return;
        }
        else if (spec instanceof Array) {
            for (var i = 0; i < spec.length; i++) {
                _parse.call(this, spec[i], parentContext, transformContext, result, dirty);
            }
        }
        else { //spec.target defined

            var isDirty = dirty || spec._dirty || (spec._dirty == undefined);

            if (cachingEnabled) {
                if (!isDirty) {
                    _parse.call(
                        this,
                        spec.target,
                        this.cache[counter],
                        this.cache[counter].transformContext,
                        result,
                        spec._dirty
                    );
                    return result;
                }
            }

            target = spec.target;
            var nextTransformContext = transformContext;

            opacity = (spec.opacity !== undefined)
                ? parentContext.opacity * spec.opacity
                : parentContext.opacity;

            transform = (spec.transform)
                ? Transform.multiply(parentContext.transform, spec.transform)
                : parentContext.transform;

            align = (spec.align)
                ? spec.align
                : parentContext.align;

            if (spec.origin) {
                origin = spec.origin;
                nextTransformContext = parentContext.transform;
            }
            else origin = parentContext.origin;

            if (spec.size || spec.proportions) {
                var parentSize = parentContext.size;
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
                    transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], transformContext));

                if (origin && (origin[0] || origin[1]))
                    transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);

                nextTransformContext = parentContext.transform;
                origin = null;
                align = null;
            }
            else size = parentContext.size;

            this.cache[counter] = {
                transform: transform,
                opacity: opacity,
                origin: origin,
                align: align,
                size: size,
                transformContext: nextTransformContext
            };

            _parse.call(
                this,
                target,
                this.cache[counter],
                this.cache[counter].transformContext,
                result,
                isDirty
            );
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
