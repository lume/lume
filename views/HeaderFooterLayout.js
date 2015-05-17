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
    var Getter = require('famous/core/GetHelper');
    var Observable = require('famous/core/Observable');

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
            defaultHeaderLength: Number.NaN,
            defaultFooterLength: Number.NaN
        },
        events : {
            resize : onResize
        },
        state : {
            headerLength : Observable,
            footerLength : Observable,
            totalLength : Observable
        },
        initialize : function initialize(options){
            this.header = null;
            this.footer = null;
            this.content = null;
        },
        setup : function(){
            this.header.on('resize', function(size){
                this.state.headerLength.set(size[this.options.direction])
            }.bind(this));

            this.footer.on('resize', function(size){
                this.state.footerLength.set(size[this.options.direction])
            }.bind(this));

            this.state.headerLength.set(_resolveNodeLength.call(this, this.header, this.options.defaultHeaderLength));
            this.state.footerLength.set(_resolveNodeLength.call(this, this.footer, this.options.defaultFooterLength));

            var headerLength = new Getter(this.state.headerLength);
            var footerLength = new Getter(this.state.footerLength);
            var totalLength = new Getter(this.state.totalLength);

            var contentLength = totalLength.map(function(totalLength){
                return totalLength - this.state.footerLength.get() - this.state.headerLength.get();
            }.bind(this));

            var contentDisplacement = headerLength;

            var footerDisplacement = totalLength.map(function(length){
                return length - this.state.footerLength.get();
            }.bind(this));

            var headerSize = headerLength.map(_outputSize.bind(this));
            var footerSize = footerLength.map(_outputSize.bind(this));
            var contentSize = contentLength.map(_outputSize.bind(this));

            var contentTransform = contentDisplacement.map(_outputTransform.bind(this));
            var footerTransform = footerDisplacement.map(_outputTransform.bind(this));

            this.add({size : headerSize})
                .add(this.header);

            this.add({size : contentSize, transform : contentTransform})
                .add(this.content);

            this.add({size : footerSize, transform : footerTransform})
                .add(this.footer);
        }
    }, CONSTANTS);

    function onResize(size){
        this.state.totalLength.set(size[this.options.direction]);
    }

    function _resolveNodeLength(node, defaultLength) {
        return (defaultLength)
            ? defaultLength
            : node.getSize()[this.options.direction];
    }

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

});
