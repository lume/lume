/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Entity = require('./Entity');
    var Context = require('./Context');
    var Transform = require('./Transform');
    var Surface = require('./Surface');

    /**
     * A Context designed to contain surfaces and set properties
     *   to be applied to all of them at once.
     *   This is primarily used for specific performance improvements in the rendering engine.
     *   Private.
     *
     * @private
     * @class Group
     * @extends Surface
     * @constructor
     * @param {Object} [options] Surface options array (see Surface})
     */
    function Group(options) {
        Surface.call(this, options);
        this._shouldRecalculateSize = false;
        this._container = document.createDocumentFragment();
        this.context = new Context(this._container);
        this.setContent(this._container);
        this._groupSize = [undefined, undefined];
        this._id = Entity.register(this);
    }

    /** @const */
    var SIZE_ZERO = [0, 0];

    Group.prototype = Object.create(Surface.prototype);
    Group.prototype.constructor = Group;
    Group.prototype.elementType = 'div';
    Group.prototype.elementClass = 'famous-group';

    /**
     * Add renderables to this component's render tree.
     *
     * @method add
     * @private
     * @param {Object} obj renderable object
     * @return {RenderNode} Render wrapping provided object, if not already a RenderNode
     */
    Group.prototype.add = function add() {
        return Context.prototype.add.apply(this.context, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    Group.prototype.render = function render() {
        return this._id;
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Group.prototype.deploy = function deploy(target) {
        this.context.migrate(target);
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    Group.prototype.recall = function recall(target) {
        this._container = document.createDocumentFragment();
        this.context.migrate(this._container);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     *
     * @private
     * @method commit
     *
     * @param {Object} spec update spec passed in from above in the render tree.
     */
    Group.prototype.commit = function commit(spec, allocator) {
        var transform = spec.transform;
        var origin = spec.origin;
        var opacity = spec.opacity;
        var size = spec.size;

        if (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) {
            this._groupSize[0] = size[0];
            this._groupSize[1] = size[1];
            this.context.setSize(size);
        }

        // parent surface
        Surface.prototype.commit.call(this, {
            transform: transform,
            opacity: opacity,
            origin: origin,
            size: SIZE_ZERO
        }, allocator);

        // child group
        Context.prototype.commit.call(this.context, {
            transform: Transform.identity,
            origin: origin,
            size: this._groupSize
        });
    };

    module.exports = Group;
});
