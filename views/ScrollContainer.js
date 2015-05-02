/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require('famous/views/Scrollview');
    var View = require('famous/core/View');

    /**
     * A Container surface with a scrollview automatically added. The convenience of ScrollContainer lies in
     * being able to clip out portions of the associated scrollview that lie outside the bounding surface,
     * and in being able to move the scrollview more easily by applying modifiers to the parent container
     * surface.
     * @class ScrollContainer
     */

    module.exports = View.extend({
        defaults : {
            container: {
                properties: {overflow : 'hidden'}
            },
            scrollview : null
        },
        initialize : function(options){
            this.container = new ContainerSurface(options.container);
            this.scrollview = new Scrollview(options.scrollview);

            this.set(this.container);
            this.container.add(this.scrollview);

            this.scrollview.subscribe(this.container);
            this._eventOutput.subscribe(this.scrollview);
        },
        /**
         * Sets the collection of renderables under the ScrollContainer instance scrollview's control.
         *
         * @method sequenceFrom
         * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous ViewSequence.
         */
        sequenceFrom : function(sequence){
            return Scrollview.prototype.sequenceFrom.apply(this.scrollview, arguments);
        }
    });

});
