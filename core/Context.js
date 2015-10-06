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
    function Context(container) {
        this.container = container || document.createElement(elementType);
        this.container.classList.add(elementClass);

        this.allocator = new ElementAllocator(this.container);

        this._node = new RootNode();

        this.size = _getElementSize(this.container);
        this._sizeDirty = false;

        this._size = new EventHandler();
        this._layout = new EventHandler();

        var DOMSizeMapper = new EventMapper(function(){
            return _getElementSize(this.container);
        }.bind(this));

        this._node._size.subscribe(DOMSizeMapper).subscribe(this._size);
        this._node._layout.subscribe(this._layout);

        this._perspective = new Transitionable(0);
        this._perspectiveDirty = false;

        //TODO: fix this hack
        this._perspective.on('update', function(){
            this._perspectiveDirty = true;
        }.bind(this));

        this._perspective.on('end', function(){
            this._perspectiveDirty = true;
        }.bind(this));

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
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
     * Gets DOM size for the Context's container.
     *
     * @method getSize
     * @return {Array.Number} Container size provided as [width, height]
     */
    Context.prototype.getSize = function getSize() {
        return this.size;
    };

    /**
     * Sets DOM size for the Context's container.
     *
     * @method setSize
     * @param size {Array.Number} Size provided as [width, height]
     */
    Context.prototype.setSize = function setSize(size) {
        if (this.size == size) return;
        this.size[0] = size[0];
        this.size[1] = size[1];
        this._sizeDirty = true;

        this.emit('resize', size);
        this._size.trigger('resize', size);
        dirtyQueue.push(function(){
            this._size.trigger('resize', size);
        }.bind(this));
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

    /**
     * Commits the CSS properties of perspective and size if they have changed.
     *  Then commits the contents of the Context's RootNode.
     *  This is called by Engine every frame when some layout or size data has changed.
     *
     * @method commit
     */
    Context.prototype.commit = function(){
        if (this._perspectiveDirty){
            _setPerspective.call(this, this.container, this.getPerspective());
            this._perspectiveDirty = false;
        }

        if (this._sizeDirty){
            _setElementSize(this.container, this.getSize());
            this._sizeDirty = false;
        }

        this._node.commit(this.allocator);
    };

    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight];
    }

    function _setElementSize(element, size) {
        element.style.width = size[0] + 'px';
        element.style.height = size[1] + 'px';
    }

    var usePrefix = !('perspective' in document.documentElement.style);

    var _setPerspective = usePrefix
        ? function _setPerspective(element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
    }
        : function _setPerspective(element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
    };

    module.exports = Context;
});
