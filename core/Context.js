/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RootNode = require('./nodes/RootNode');
    var EventHandler = require('./EventHandler');
    var ElementAllocator = require('./ElementAllocator');
    var Transitionable = require('./Transitionable');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var Stream = require('samsara/streams/Stream');
    var EventMapper = require('samsara/events/EventMapper');
    var SizeNode = require('samsara/core/SizeNode');
    var sizeAlgebra = require('samsara/core/algebras/size');

    var elementType = 'div';
    var elementClass = 'samsara-context';

    /**
     * A Context defines a top-level DOM element inside which other nodes (like Surfaces) are rendered.
     *  This DOM element can be provided as an argument if it exists in the document,
     *  otherwise it is created for you and appended to the document's `<body>`.
     *
     *  The CSS class `samsara-context` is applied, which provides the minimal CSS necessary
     *  to create a performant 3D context (specifically preserve-3d).
     *
     * @class Context
     * @constructor
     * @namespace Core
     * @uses Core.RootNode
     * @param container {Node} DOM element which will serve as a container for added nodes.
     */
    function Context(options) {
        options = options || {};
        container = options.el || document.createElement(elementType);
        container.classList.add(elementClass);

        var allocator = new ElementAllocator(container);

        this._node = new RootNode(allocator);

        this._sizeNode = new SizeNode();

        this._size = new EventHandler();
        this._layout = new EventHandler();

        this.size = ResizeStream.lift(function(sizeSpec, parentSize){
            if (!parentSize) return false;
            return sizeAlgebra(sizeSpec, parentSize);
        }, [this._sizeNode, this._size]);

        this._node._size.subscribe(this._size);
        this._node._layout.subscribe(this._layout);

        this._perspective = new Transitionable(0);

        this._perspective.on('update', function(perspective){
            setPerspective(container, perspective);
        });

        this._perspective.on('end', function(perspective){
            setPerspective(container, perspective);
        });

        this._size.on('resize', function(size){
            setElementSize(container, size);
        });

        this.container = container;
    }

    /**
     * Extends the scene graph beginning with the Context's RootNode with a new node.
     *  Delegates to RootNode's `add` method.
     *
     * @method add
     *
     * @param {Object}          Renderable
     * @return {SceneGraphNode} Wrapped node
     */
    Context.prototype.add = function add() {
        return RootNode.prototype.add.apply(this._node, arguments);
    };

    /**
     * Sets DOM size for the Context's container.
     *
     * @method setSize
     * @param size {Array.Number} Size provided as [width, height]
     */
    Context.prototype.setSize = function setSize(size) {
        this._sizeNode.set({size : size});
    };

    /**
     * Get current perspective of this Context in pixels.
     *
     * @method getPerspective
     * @return {Number} Perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspective.get();
    };

    /**
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param perspective {Number}  Perspective in pixels
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback executed on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        this._perspective.set(perspective, transition, callback);
    };

    function setElementSize(target, size) {
        if (size[0] === true) size[0] = target.offsetWidth;
        else target.style.width = size[0] + 'px';

        if (size[1] === true) size[1] = target.offsetHeight;
        else target.style.height = size[1] + 'px';
    }

    var usePrefix = !('perspective' in document.documentElement.style);

    var setPerspective = usePrefix
        ? function setPerspective(element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
    }
        : function setPerspective(element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
    };

    module.exports = Context;
});
