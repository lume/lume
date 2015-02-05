/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var RenderNode = require('../core/RenderNode');
    var Transform = require('../core/Transform');
    var View = require('./View');

    /**
     * A layout which will arrange three renderables into a header and footer area of defined size,
      and a content area of flexible size.
     * @class HeaderFooterLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=HeaderFooterLayout.DIRECTION_Y] A direction of HeaderFooterLayout.DIRECTION_X
     * lays your HeaderFooterLayout instance horizontally, and a direction of HeaderFooterLayout.DIRECTION_Y
     * lays it out vertically.
     * @param {Number} [options.headerLength=undefined]  The amount of pixels allocated to the header node
     * in the HeaderFooterLayout instance's direction.
     * @param {Number} [options.footerLength=undefined] The amount of pixels allocated to the footer node
     * in the HeaderFooterLayout instance's direction.
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
        initialize : function initialize(options){
            this.header = new RenderNode();
            this.footer = new RenderNode();
            this.content = new RenderNode();
        },
        render : function render(parentSpec){
            var options = this.options;
            var size = parentSpec.size;

            var headerLength = (options.headerLength !== undefined)
                ? this.options.headerLength
                : _resolveNodeLength.call(this, this.header, options.defaultHeaderLength);

            var footerLength = (options.footerLength !== undefined)
                ? options.footerLength
                : _resolveNodeLength.call(this, this.footer, options.defaultFooterLength);

            var contentLength = size[options.direction] - headerLength - footerLength;

            return [
                {
                    size: _finalSize.call(this, headerLength, size),
                    target: this.header.render()
                },
                {
                    transform: _outputTransform.call(this, headerLength),
                    size: _finalSize.call(this, contentLength, size),
                    target: this.content.render()
                },
                {
                    transform: _outputTransform.call(this, headerLength + contentLength),
                    size: _finalSize.call(this, footerLength, size),
                    target: this.footer.render()
                }
            ];
        }
    }, CONSTANTS);

    function _resolveNodeLength(node, defaultLength) {
        var nodeSize = node.getSize();
        return nodeSize ? nodeSize[this.options.direction] : defaultLength;
    }

    function _outputTransform(offset) {
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translate(offset, 0, 0)
            : Transform.translate(0, offset, 0);
    }

    function _finalSize(directionSize, size) {
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? [directionSize, size[1]]
            : [size[0], directionSize];
    }

});
