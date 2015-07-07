
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Context = require('famous/core/Context');
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');

    /**
     * ContainerSurface is an object designed to contain surfaces and
     *   set properties to be applied to all of them at once.
     *   This extends the Surface class.
     *   A container surface will enforce these properties on the
     *   surfaces it contains:
     *
     *   size (clips contained surfaces to its own width and height);
     *
     *   origin;
     *
     *   its own opacity and transform, which will be automatically
     *   applied to  all Surfaces contained directly and indirectly.
     *
     * @class ContainerSurface
     * @extends Surface
     * @constructor
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on all inner content
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface (should not be used)
     */
    function ContainerSurface(options) {
        Surface.call(this, options);

        this._container = document.createElement('div');
        this._container.classList.add('famous-group');
        this._container.classList.add('famous-container');

        this.context = new Context(this._container);
        this.setContent(this._container);

        this._eventInput.subscribe(this.context);

        this._eventInput.on('resize', function(){
            var size = this.getSize();
            this.context.setSize(size);
            this.emit('resize', size);
        }.bind(this));

        // TODO: put deploy in Context
        this.on('deploy', function(){
            this.context.trigger('start');
            dirtyQueue.push(function(){
                this.context.trigger('end');
            }.bind(this));
        }.bind(this));
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = 'famous-surface';

    ContainerSurface.prototype.setPerspective = function setPerspective(){
        Context.prototype.setPerspective.apply(this.context, arguments);
    };

    /**
     * Add renderables to this object's render tree
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    ContainerSurface.prototype.add = function add() {
        return Context.prototype.add.apply(this.context, arguments);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
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
     * @private
     * @method commit
     * @param {Spec} spec commit context
     */
    ContainerSurface.prototype.commit = function commit(spec, allocator) {
        Surface.prototype.commit.apply(this, arguments);
        Context.prototype.commit.apply(this.context);
    };

    module.exports = ContainerSurface;
});
