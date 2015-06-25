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
    var LayoutNode = require('famous/core/nodes/LayoutNode');
    var Stream = require('famous/streams/Stream');

    /**
     * A layout which will arrange three renderables into a header and footer area of defined size,
     *   and a content area of flexible size.
     * @class HeaderFooterLayout
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    var HeaderFooterLayout = View.extend({
        defaults : {
            direction: CONSTANTS.DIRECTION.Y,
            defaultHeaderLength: Number.NaN,
            defaultFooterLength: Number.NaN
        },
        events : {},
        initialize : function initialize(options){
            this.headerLength = null;
            this.footerLength = null;
        },
        //TODO: first header, then footer, then content
        addHeader : function(header){
            //TODO: create size stream within Surface
            this.headerLength = header.__size.map(function(size){
                return size[this.options.direction];
            }.bind(this));

            var size = this.headerLength.map(function(length){
                return _outputSize.call(this, length);
            }.bind(this));

            var layoutNode = new LayoutNode({size : size});

            this.add(layoutNode).add(header);
        },
        addFooter : function(footer){
            this.footerLength = footer.__size.map(function(size){
                return size[this.options.direction];
            }.bind(this));

            var size = this.headerLength.map(function(length){
                return _outputSize.call(this, length);
            }.bind(this));

            var transform = Stream.lift(function(size, footerLength){
                var length = size[this.options.direction] - footerLength;
                return _outputTransform.call(this, length);
            }.bind(this), [this.size, this.footerLength]);

            var layoutNode = new LayoutNode({
                size : size,
                transform : transform
            });

            this.add(layoutNode).add(footer);
        },
        addContent : function(content){
            var contentLength = Stream.lift(function(size, headerLength, footerLength){
                return size[this.options.direction] - headerLength - footerLength;
            }.bind(this), [this.size, this.headerLength, this.footerLength]);

            var size = contentLength.map(function(length){
                return _outputSize.call(this, length);
            }.bind(this));

            var transform = this.headerLength.map(function(length){
                return _outputTransform.call(this, length);
            }.bind(this));

            var layoutNode = new LayoutNode({
                size : size,
                transform : transform
            });

            this.add(layoutNode).add(content);
        }
    }, CONSTANTS);

    function _outputTransform(offset) {
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
    }

    function _outputSize(length) {
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? [length, undefined]
            : [undefined, length];
    }

    module.exports = HeaderFooterLayout;
});
