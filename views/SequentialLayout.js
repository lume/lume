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
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    var SequentialLayout = module.exports = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.Y,
            itemSpacing : 0
        },
        initialize : function initialize(){
            this._items = null;
            this._size = [undefined, undefined];
            this._cachedLength = Number.NaN;
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
        render : function render(parentSpec){
            var direction = this.options.direction;
            var antiDirection = 1 - direction;

            var currentNode = this._items;
            var i = 0;
            var length = 0;
            var width = 0;
            var itemSize;

            while (currentNode) {
                var item = currentNode.get();

                if (!item) break;

                if (item.getSize)
                    itemSize = item.getSize();

                var transform = this._outputFunction.call(this, length, i);

                this.spec.getChild(i)
                    .setTransform(transform)
                    .setTarget(item);

                if (itemSize && itemSize[direction])
                    length += itemSize[direction] + this.options.itemSpacing;

                if (itemSize && itemSize[antiDirection] > width)
                    width = itemSize[antiDirection];

                currentNode = currentNode.getNext();
                i++;
            }

            this._size[antiDirection] = width;

            if (length !== this._cachedLength) {
                this._cachedLength = length;
                this._size[direction] = length;
            }

            this.spec.setSize(this.getSize());

            return this.spec.render();
        }
    }, CONSTANTS);

    function _defaultOutputFunction(offset, index) {
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
    };
});
