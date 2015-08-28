/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var Transform = require('samsara/core/Transform');
    var Stream = require('samsara/streams/Stream');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var SizeNode = require('samsara/core/nodes/SizeNode');
    var sizeAlgebra = require('samsara/core/algebras/size');
    var register = require('samsara/core/register');

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class ElementOutput
     * @constructor
     *
     * @param {Node} element document parent of this container
     */
    function ElementOutput(element) {
        this._transform = null;
        this._opacity = 1;
        this._origin = [0,0];
        this._size = null;  // always a numeric value. commited to clientWidth, clientHeight

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.eventForwarder = function eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);

        this.sizeNode = new SizeNode();
        this.__size = new EventHandler();

        this.size = ResizeStream.lift(function elementSizeLift(sizeNode, parentSize){
//            if (!parentSize) return; // occurs when surface is never added
            return sizeAlgebra(sizeNode, parentSize);
        }, [this.sizeNode, this.__size]);

        this.size.on('resize', function(size){
            this._sizeDirty = true;
            this._size = size;
        }.bind(this));

        this._currentTarget = null;

        this._opacityDirty = true;
        this._sizeDirty = true;
        this._originDirty = true;
        this._transformDirty = true;

        register(this);
        if (element) this.attach(element);
    }

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler callback
     * @return {EventHandler} this
     */
    ElementOutput.prototype.on = function on(type, fn) {
        if (this._currentTarget)
            this._currentTarget.addEventListener(type, this.eventForwarder);
        this._eventOutput.on(type, fn);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on"
     *
     * @method removeListener
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler
     */
    ElementOutput.prototype.off = function off(type, fn) {
        this._eventOutput.off(type, fn);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} [event] event data
     * @return {EventHandler} this
     */
    ElementOutput.prototype.emit = function emit(type, event) {
        var handled = this._eventOutput.emit(type, event);
        if (handled && event && event.stopPropagation) event.stopPropagation();
        return handled;
    };

    var usePrefix = !('transform' in document.documentElement.style);
    var devicePixelRatio = window.devicePixelRatio || 1;
    var invDevicePixelRatio = 1 / devicePixelRatio;

    var MIN_OPACITY = 0.0001;
    var MAX_OPACITY = 0.9999;

    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners)
            target.addEventListener(i, this.eventForwarder);
    }

    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners)
            target.removeEventListener(i, this.eventForwarder);
    }

    function _formatCSSTransform(transform) {
        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (i === 12 || i === 13)
                ? Math.round(transform[i] * devicePixelRatio) * invDevicePixelRatio + ','
                : transform[i] + ',';
        }
        return result + transform[15] + ')';
    }

    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    var _setOpacity = function _setOpacity(element, opacity){
        if (opacity >= MAX_OPACITY)     opacity = MAX_OPACITY;
        else if (opacity < MIN_OPACITY) opacity = MIN_OPACITY;
        element.style.opacity = opacity;
    };

    var _setOrigin = usePrefix
        ? function _setOrigin(element, origin) {
            element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
        }
        : function _setOrigin(element, origin) {
            element.style.transformOrigin = _formatCSSOrigin(origin);
        };

    var _setTransform = (usePrefix)
        ? function _setTransform(element, transform) {
            element.style.webkitTransform = _formatCSSTransform(transform);
        }
        : function _setTransform(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };

    var _setInvisible = usePrefix
        ? function(element) {
            element.style.webkitTransform = 'scale3d(0.0001,0.0001,0.0001)';
            element.style.opacity = MIN_OPACITY;
        }
        : function(element) {
            element.style.transform = 'scale3d(0.0001,0.0001,0.0001)';
            element.style.opacity = MIN_OPACITY;
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
    ElementOutput.prototype.commit = function commit(spec) {
        var target = this._currentTarget;
        if (!target) return;

        if (this._sizeDirty) {
            if (this._size[0] === true) this._size[0] = target.offsetWidth;
            else target.style.width = Math.round(this._size[0] * devicePixelRatio) * invDevicePixelRatio + 'px';

            if (this._size[1] === true) this._size[1] = target.offsetHeight;
            else target.style.height = Math.round(this._size[1] * devicePixelRatio) * invDevicePixelRatio + 'px';

            this._sizeDirty = false;
        }

        if (!spec) return;

        var transform = spec.transform || Transform.identity;
        var opacity = (spec.opacity === undefined) ? 1 : spec.opacity;
        var origin = spec.origin;

        this._transformDirty = Transform.notEquals(this._transform, transform);
        this._opacityDirty = (this._opacity !== opacity);

        if (origin && _xyNotEquals(this._origin, origin)){
            this._origin[0] = origin[0];
            this._origin[1] = origin[1];
            this._originDirty = true;
        }

        if (this._opacityDirty) {
            this._opacity = opacity;
            _setOpacity(target, opacity);
        }

        if (this._originDirty)
            _setOrigin(target, this._origin);

        if (this._transformDirty || this._originDirty || this._sizeDirty) {
            if (!(this._origin[0] === 0 && this._origin[1] === 0)){
                var originShift = [-this._size[0]*this._origin[0], -this._size[1]*this._origin[1], 0];
                transform = Transform.thenMove(transform, originShift);
            }
            _setTransform(target, transform);
            this._transform = transform;
        }

        this._originDirty = false;
        this._transformDirty = false;
        this._opacityDirty = false;
    };

    ElementOutput.prototype.cleanup = function cleanup() {
        if (!this._currentTarget) return;
        _setInvisible(this._currentTarget);
        this._currentTarget.style.display = 'none';
    };

    /**
     * Assigns the currentTarget for committing and binds event listeners.
     *
     * @private
     * @method attach
     * @param {Node} target document parent of this container
     */
    ElementOutput.prototype.attach = function attach(target) {
        this._currentTarget = target;
        _addEventListeners.call(this, target);
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method detach
     */
    ElementOutput.prototype.detach = function detach() {
        var target = this._currentTarget;
        if (target) {
            _removeEventListeners.call(this, target);
            target.style.display = '';
        }
        this._currentTarget = null;
    };

    module.exports = ElementOutput;
});
