/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Surface = require('samsara/core/Surface');
    var Context = require('samsara/core/Context');
    var EventHandler = require('samsara/core/EventHandler');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var Transform = require('samsara/core/Transform');

    var defaultLayout = {
        transform : Transform.identity,
        opacity : 1,
        origin : null,
        align : null,
        nextSizeTransform : Transform.identity
    };

    /**
     * ContainerSurface enables nesting of DOM. A ContainerSurface manages
     *  its own Scene Graph that it inserts inside a DOM node. Typically
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
     * @param [options.classes] {string[]}      CSS classes
     * @param [options.properties] {Object}     Dictionary of CSS properties
     * @param [options.attributes] {Object}     Dictionary of HTML attributes
     * @param [options.content] {string}        InnerHTML content
     * @param [options.origin] {Number[]}       Origin (x,y), with values between 0 and 1
     * @param [options.proportions] {Number[]}  Proportions (x,y) with values between 0 and 1
     * @param [options.margins] {Number[]}      Margins (x,y) in pixels
     * @param [options.opacity] {Number}        Opacity
     */
    function ContainerSurface(options) {
        Surface.call(this, options);

        this._container = document.createElement('div');
        this._container.classList.add('samsara-container');

        this.context = new Context(this._container);
        this.setContent(this._container);

        this.size.on('resize', function(){
            var size = _getElementSize(this._container);
            this.context.setSize(size);
            this.emit('resize', size);
        }.bind(this));

        preTickQueue.push(function(){
            this.context._layout.trigger('start', defaultLayout);
            dirtyQueue.push(function(){
                this.context._layout.trigger('end', defaultLayout);
            }.bind(this));
        }.bind(this));
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = 'samsara-surface';

    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight];
    }

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
     * Extends the scene graph with a provided node.
     *
     * @method add
     * @param node {Object}     Node, Surface, or View
     * @return {SceneGraphNode}
     */
    ContainerSurface.prototype.add = function add() {
        return Context.prototype.add.apply(this.context, arguments);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @method deploy
     * @private
     * @param {Node} target document parent of this container
     */
    ContainerSurface.prototype.deploy = function deploy() {
        return Surface.prototype.deploy.apply(this, arguments);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @method commit
     * @private
     * @param {Spec} spec commit context
     */
    ContainerSurface.prototype.commit = function commit(spec, allocator) {
        Surface.prototype.commit.apply(this, arguments);
        Context.prototype.commit.apply(this.context);
    };

    module.exports = ContainerSurface;
});
