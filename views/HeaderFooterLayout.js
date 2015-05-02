/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Spec = require('famous/core/Spec');

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

    module.exports = View.extend({
        defaults : {
            direction: CONSTANTS.DIRECTION.Y,
            headerLength: undefined,
            footerLength: undefined,
            defaultHeaderLength: 0,
            defaultFooterLength: 0
        },
        state : {
            headerLength : Number,
            footerLength : Number,
            direction : Number
        },
        initialize : function initialize(options){
            this.header = null;
            this.footer = null;
            this.content = null;

            this.state.headerLength = options.headerLength;
            this.state.footerLength = options.footerLength;
            this.state.direction = options.direction;

            var spec = new Spec();
            this.add(function(size){
                var headerLength = (this.state.headerLength !== undefined)
                    ? this.state.headerLength
                    : _resolveNodeLength.call(this, this.header, options.defaultHeaderLength);

                var footerLength = (this.state.footerLength !== undefined)
                    ? this.state.footerLength
                    : _resolveNodeLength.call(this, this.footer, options.defaultFooterLength);

                var contentLength = size[this.state.direction] - headerLength - footerLength;

                spec.getChild(0)
                    .setSize(_finalSize.call(this, headerLength, size))
                    .setTarget(this.header);

                spec.getChild(1)
                    .setTransform(_outputTransform.call(this, headerLength))
                    .setSize(_finalSize.call(this, contentLength, size))
                    .setTarget(this.content);

                spec.getChild(2)
                    .setTransform(_outputTransform.call(this, headerLength + contentLength))
                    .setSize(_finalSize.call(this, footerLength, size))
                    .setTarget(this.footer);

                return spec;
            }.bind(this));
        }
    }, CONSTANTS);

    function _resolveNodeLength(node, defaultLength) {
        var nodeSize = node.getSize();
        return nodeSize ? nodeSize[this.state.direction] : defaultLength;
    }

    function _outputTransform(offset) {
        return (this.state.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
    }

    function _finalSize(directionSize, size) {
        return (this.state.direction === CONSTANTS.DIRECTION.X)
            ? [directionSize, size[1]]
            : [size[0], directionSize];
    }

});
