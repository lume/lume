/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Surface = require('./Surface');
    var Context = require('./Context');
    var dirtyQueue = require('../core/queues/dirtyQueue');
    var preTickQueue = require('../core/queues/preTickQueue');
    var Transform = require('../core/Transform');
    var EventHandler = require('../events/EventHandler');

    /**
     * ContainerSurface enables nesting of DOM. A ContainerSurface manages
     *  its own render tree that it inserts inside a DOM node. Typically
     *  this is used for clipping by settings `{overflow : hidden}` as a CSS
     *  property.
     *
     *  @example
     *
     *      var myContainer = new ContainerSurface({
     *          size : [100,100],
     *          properties : {overflow : hidden}
     *      });
     *
     *      var surface = new Surface({
     *          size : [200,200],
     *          properties : {background : 'red'}
     *      });
     *
     *      myContainer.add(surface);
     *
     *      context.add(myContainer);
     *
     * @class ContainerSurface
     * @extends Core.Surface
     * @namespace Core
     * @uses Core.Context
     * @constructor
     *
     * @param [options] {Object}                Options
     * @param [options.size] {Number[]}         Size (width, height) in pixels. These can also be `true` or `undefined`.
     * @param [options.classes] {String[]}      CSS classes
     * @param [options.properties] {Object}     Dictionary of CSS properties
     * @param [options.attributes] {Object}     Dictionary of HTML attributes
     * @param [options.content] {String}        InnerHTML content
     * @param [options.origin] {Number[]}       Origin (x,y), with values between 0 and 1
     * @param [options.proportions] {Number[]}  Proportions (x,y) with values between 0 and 1
     * @param [options.margins] {Number[]}      Margins (x,y) in pixels
     * @param [options.opacity] {Number}        Opacity
     */
    function ContainerSurface(options) {
        Surface.call(this, options);
        this.context = new Context();
        this.context._size.subscribe(this.size);

        this.on('deploy', function(){
            this.context.mount(this._currentTarget, true);
        }.bind(this));
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = ['samsara-surface', 'samsara-container'];

    /**
     * Get current perspective in pixels.
     *
     * @method getPerspective
     * @return {Number} Perspective in pixels
     */
    ContainerSurface.prototype.getPerspective = function getPerspective() {
        return Context.prototype.getPerspective.apply(this.context, arguments);
    };

    /**
     * Set current perspective in pixels.
     *
     * @method setPerspective
     * @param perspective {Number}  Perspective in pixels
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback executed on completion of transition
     */
    ContainerSurface.prototype.setPerspective = function setPerspective(){
        Context.prototype.setPerspective.apply(this.context, arguments);
    };

    /**
     * Extends the render tree with a provided node.
     *
     * @method add
     * @param node {Object}     Node, Surface, or View
     * @return {RenderTreeNode}
     */
    ContainerSurface.prototype.add = function add() {
        return Context.prototype.add.apply(this.context, arguments);
    };

    module.exports = ContainerSurface;
});
