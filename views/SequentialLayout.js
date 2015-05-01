/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var View = require('famous/core/View');
    var Spec = require('famous/core/Spec');

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
        state : {
            items : ViewSequence,
            length : Number,
            direction : Number
        },
        initialize : function initialize(options){
            this.state.items = null;
            this.state.direction = options.direction;
            this.state.length = 0;

            this._outputFunction = _defaultOutputFunction;

            var spec = new Spec();
            this.add(function(){
                var direction = this.state.direction;

                var currentNode = this.state.items;
                var i = 0;
                var length = 0;
                var itemSize;
                while (currentNode) {
                    var item = currentNode.get();

                    if (!item) break;

                    if (item.getSize) itemSize = item.getSize();

                    var transform = this._outputFunction.call(this, length, i);

                    if (itemSize){
                        var itemLength = itemSize[direction];
                        if (itemLength)
                            length += itemLength + this.options.itemSpacing;
                    }

                    spec.getChild(i)
                        .setTransform(transform)
                        .setTarget(item);

                    currentNode = currentNode.getNext();
                    i++;
                }

                this.state.length = length;

                return spec;
            }.bind(this));
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
         * Sets the collection of renderables under the SequentialLayout instance's control.
         *
         * @method sequenceFrom
         * @param {Array|ViewSequence} items Either an array of renderables or a Famous viewSequence.
         * @chainable
         */
        sequenceFrom : function sequenceFrom(items) {
            if (items instanceof Array) items = new ViewSequence(items);
            this.state.items = items;
            return items;
        }
    }, CONSTANTS);

    function _defaultOutputFunction(offset, index) {
        return (this.state.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
    }
});
