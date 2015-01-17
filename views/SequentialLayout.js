/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var ViewSequence = require('../core/ViewSequence');
    var View = require('./View');

    /**
     * SequentialLayout will lay out a collection of renderables sequentially in the specified direction.
     * @class SequentialLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the SequentialLayout instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 0
        }
    };

    module.exports = View.extend({
        name : 'SequentialLayout',
        defaults : {
            direction : CONSTANTS.DIRECTION.Y,
            itemSpacing : 0
        },
        initialize : function initialize(){
            this._items = null;
            this._size = [undefined, undefined];
            this._cachedLength = 0;
            this._outputFunction = _defaultOutputFunction;
        },
        /**
         * setOutputFunction is used to apply a user-defined output transform on each processed renderable.
         *  For a good example, check out SequentialLayout's own DEFAULT_OUTPUT_FUNCTION in the code.
         *
         * @method setOutputFunction
         * @param {Function} outputFunction An output processer for each renderable in the SequentialLayout
         * instance.
         */
        setOutputFunction : function setOutputFunction(outputFunction) {
            this._outputFunction = outputFunction;
        },
        /**
         * Returns the width and the height of the SequentialLayout instance.
         *
         * @method getSize
         * @return {Array} A two value array of the SequentialLayout instance's current width and height (in that order).
         */
        getSize : function getSize(){
            return this._size;
        },
        /**
         * Sets the collection of renderables under the SequentialLayout instance's control.
         *
         * @method sequenceFrom
         * @param {Array|ViewSequence} items Either an array of renderables or a Famous viewSequence.
         * @chainable
         */
        sequenceFrom : function sequenceFrom(items) {
            if (items instanceof Array) items = new ViewSequence(items);
            this._items = items;
            return this;
        },
        render : function render(){
            var length             = 0;
            var secondaryDirection = this.options.direction ^ 1;
            var currentNode        = this._items;
            var item               = null;
            var itemSize           = [];
            var output             = {};
            var result             = [];
            var i                  = 0;

            while (currentNode) {
                item = currentNode.get();
                if (!item) break;

                if (item.getSize) itemSize = item.getSize();

                output = this._outputFunction.call(this, item, length, i++);
                result.push(output);

                if (itemSize) {
                    if (itemSize[this.options.direction])
                        length += itemSize[this.options.direction];
                    if (itemSize[secondaryDirection] > this._size[secondaryDirection])
                        this._size[secondaryDirection] = itemSize[secondaryDirection];
                }

                currentNode = currentNode.getNext();

                if (this.options.itemSpacing && currentNode) length += this.options.itemSpacing;
            }

            if (length !== this._cachedLength) {
                this._cachedLength = length;
                this._size[this.options.direction] = length;
            }

            return {
                size: this.getSize(),
                target: result
            };
        }
    }, CONSTANTS);

    function _defaultOutputFunction(input, offset, index) {
        var transform = (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
        return {
            transform: transform,
            target: input.render()
        };
    };
});
