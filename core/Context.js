/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RenderNode = require('./RenderNode');
    var EventHandler = require('./EventHandler');
    var ElementAllocator = require('./ElementAllocator');
    var Transform = require('./Transform');
    var Transitionable = require('./Transitionable');
    var Entity = require('./Entity');

    /**
     * The top-level container for a Famous-renderable piece of the document.
     *   It is directly updated by the process-wide Engine object, and manages one
     *   render tree root, which can contain other renderables.
     *
     * @class Context
     * @constructor
     * @private
     * @param {Node} container Element in which content will be inserted
     */
    function Context(container) {
        this.container = container;
        this.allocator = new ElementAllocator(container);

        this._node = new RenderNode();

        this._dirty = true;
        this._dirtyLock = 0;

        this._size = _getElementSize(this.container);

        this._perspective = new Transitionable(0);

        this._nodeContext = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: this._size,
            nextSizeTransform : Transform.identity
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        this._eventInput.bindThis(this);

        this._eventInput.subscribe(this._node);
        this._eventInput.subscribe(this._perspective);

        this._eventInput.on('resize', function() {
            this.setSize(_getElementSize(this.container));
        }.bind(this));

        this._eventInput.on('dirty', _onDirty);
        this._eventInput.on('clean', _onClean);
        this._eventInput.on('start', _onStart);
        this._eventInput.on('end', _onEnd);
    }

    var usePrefix = !('perspective' in document.documentElement.style);

    function _onDirty(){
        if (!this._dirty) {
            this._dirty = true;
            this._eventOutput.emit('dirty');
        }
    }

    function _onClean(){
        this._dirtyLock--;
        if (this._dirty && this._dirtyLock == 0) {
            this._dirty = false;
            this._eventOutput.emit('clean');
        }
    }

    function _onStart(){
        if (!this._dirty){
            this._dirty = true;
            this._eventOutput.emit('dirty');
        }
        this._dirtyLock++;
    }

    function _onEnd(){
        this._dirtyLock--;
        if (this._dirty && this._dirtyLock == 0) {
            this._dirty = false;
            this._eventOutput.emit('clean');
        }
    }

    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight];
    }

    var _setPerspective = usePrefix
        ? function(element, perspective) {
            element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
        }
        : function(element, perspective) {
            element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
        };

    // Note: Unused
    Context.prototype.getAllocator = function getAllocator() {
        return this.allocator;
    };

    /**
     * Add renderables to this Context's render tree.
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    Context.prototype.add = function add(obj) {
        return RenderNode.prototype.add.call(this._node, obj);
    };

    /**
     * Move this Context to another containing document element.
     *
     * @method migrate
     *
     * @param {Node} container Element to which content will be migrated
     */
    Context.prototype.migrate = function migrate(container) {
        if (container === this.container) return;
        this.container = container;
        this.allocator.migrate(container);
    };

    /**
     * Gets viewport size for Context.
     *
     * @method getSize
     *
     * @return {Array.Number} viewport size as [width, height]
     */
    Context.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Sets viewport size for Context.
     *
     * @method setSize
     *
     * @param {Array.Number} size [width, height].  If unspecified, use size of root document element.
     */
    Context.prototype.setSize = function setSize(size) {
        if (!size) size = _getElementSize(this.container);
        this._size[0] = size[0];
        this._size[1] = size[1];
        this._dirty = true;
    };

    /**
     * Commit this Context's content changes to the document.
     *
     * @private
     * @method update
     * @param {Object} spec
     * @param {Object} allocator
     */

    Context.prototype.commit = function commit(spec, allocator){
        spec = spec || this._nodeContext;
        allocator = allocator || this.allocator;

        if (this._perspective.isActive())
            _setPerspective(this.container, this._perspective.get());

        this._node.render(spec);
        this._node.commit(allocator);

        if (this._dirty && this._dirtyLock == 0) this._dirty = false;
    };

    /**
     * Get current perspective of this context in pixels.
     *
     * @method getPerspective
     * @return {Number} depth perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspective.get();
    };

    /**
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param {Number} perspective in pixels
     * @param {Object} transition object for applying the change
     * @param {Function} callback function called on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        if (transition === undefined) _setPerspective(this.container, perspective);
        this._perspective.set(perspective, transition, callback);
    };

    module.exports = Context;
});
