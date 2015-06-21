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
    var View = require('famous/core/View');
    var Observable = require('famous/core/Observable');
    var LayoutGetter = require('famous/core/LayoutGetter');

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
        events : {},
        initialize : function initialize(){
            this.items = new Observable();
            this._outputFunction = _defaultOutputFunction;
            this.size = null;
            this.length = undefined;
        },
        setup : function(){
            this.items.map(function(items){
                var size = items.getSize();
            });

            var transforms = layout.map(function(surfaces){
                var direction = this.options.direction;
                var spacing = this.options.itemSpacing;
                var transforms = [];
                var length = 0;
                for (var i = 0; i < surfaces.length; i++){
                    var transform = this._outputFunction.call(this, length);
                    transforms.push(transform);
                    length += surfaces[i].getSize()[direction] + spacing;
                }
                this.length = length;
                return transforms;
            }.bind(this));

            for (var i = 0; i < this.state.items.length; i++){
                var item = this.state.items[i];
                this.add({transform : transforms.pluck(i)}).add(item);
            }
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
            this.items.set(items);
            this.setup();
        }
    }, CONSTANTS);

    function onResize(size){
        this.size = size;
    }

    function _defaultOutputFunction(offset, index) {
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
    }
});
