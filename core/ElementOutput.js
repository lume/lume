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
    var SizeNode = require('samsara/core/SizeNode');
    var LayoutNode = require('samsara/core/LayoutNode');
    var register = require('samsara/core/register');
    var sizeAlgebra = require('samsara/core/algebras/size');
    var layoutAlgebra = require('samsara/core/algebras/layout');

    var usePrefix = !('transform' in document.documentElement.style);
    var devicePixelRatio = window.devicePixelRatio || 1;
    var invDevicePixelRatio = 1 / devicePixelRatio;
    var MIN_OPACITY = 0.0001;
    var MAX_OPACITY = 0.9999;
    var EPSILON = 1e-5;
    var _zeroZero = [0,0];

    /**
     * Responsible for committing CSS3 properties to the DOM and providing DOM event hooks
     *  from a provided DOM element. Where Surface's API handles inputs from the developer
     *  from within Samsara, ElementOutput handles the DOM interaction layer.
     *
     *
     * @class ElementOutput
     * @constructor
     * @extensionfor Surface
     * @uses LayoutNode
     * @uses SizeNode
     * @private
     * @param {Node} element document parent of this container
     */
    function ElementOutput(element) {
        this._currentTarget = null;

        this._cachedSpec = {
            transform : null,
            opacity : 1,
            origin : null,
            size : null
        };

        this._opacityDirty = true;
        this._sizeDirty = true;
        this._originDirty = true;
        this._transformDirty = true;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventForwarder = function _eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);

        this._sizeNode = new SizeNode();
        this._layoutNode = new LayoutNode();

        this._size = new EventHandler();
        this._layout = new EventHandler();

        this.size = ResizeStream.lift(function elementSizeLift(sizeSpec, parentSize){
            if (!parentSize) return; // occurs when surface is never added
            return sizeAlgebra(sizeSpec, parentSize);
        }, [this._sizeNode, this._size]);

        this.layout = Stream.lift(function(parentSpec, objectSpec, size){
            if (!parentSpec || !size) return;
            return (objectSpec)
                ? layoutAlgebra(objectSpec, parentSpec, size)
                : parentSpec;
        }, [this._layout, this._layoutNode, this.size]);

        this.size.on('resize', function(size){
            this._sizeDirty = true;
            this._cachedSpec.size = size;
        }.bind(this));

        this._currentTarget = null;

        this._opacityDirty = true;
        this._sizeDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
        this._isVisible = true;

        register(this);
        if (element) this.attach(element);
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

    var _setSize = function _setSize(target, size){
        if (size[0] === true) size[0] = target.offsetWidth;
        else target.style.width = Math.ceil(size[0] * devicePixelRatio) * invDevicePixelRatio + 'px';

        if (size[1] === true) size[1] = target.offsetHeight;
        else target.style.height = Math.ceil(size[1] * devicePixelRatio) * invDevicePixelRatio + 'px';
    };


    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners)
            target.addEventListener(i, this._eventForwarder);
    }

    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners)
            target.removeEventListener(i, this._eventForwarder);
    }

    function _formatCSSTransform(transform) {
        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            if (Math.abs(transform[i]) < EPSILON) transform[i] = 0;
            result += (i === 12 || i === 13)
                ? Math.round(transform[i] * devicePixelRatio) * invDevicePixelRatio + ','
                : transform[i] + ',';
        }
        return result + transform[15] + ')';
    }

    // {Visibility : hidden} allows for DOM events to pass through the element
    var _setOpacity = function _setOpacity(element, opacity){
        if (!this._isVisible && opacity > MIN_OPACITY){
            element.style.visibility = 'visible';
            this._isVisible = true;
        }

        if (opacity > MAX_OPACITY) opacity = MAX_OPACITY;
        else if (opacity < MIN_OPACITY) {
            opacity = MIN_OPACITY;
            if (this._isVisible){
                element.style.visibility = 'hidden';
                this._isVisible = false;
            }
        }

        if (this._isVisible) element.style.opacity = opacity;
    };

    /**
     * Adds a handler to the `type` channel which will be executed on `emit`.
     *
     * @method on
     *
     * @param type {string}         DOM event channel name, e.g., "click", "touchmove"
     * @param handler {function}    Handler. It's only argument will be an emitted data payload.
     */
    ElementOutput.prototype.on = function on(type, handler) {
        if (this._currentTarget)
            this._currentTarget.addEventListener(type, this._eventForwarder);
        EventHandler.prototype.on.apply(this._eventOutput, arguments);
    };

    /**
     * Removes a previously added handler to the `type` channel.
     *  Undoes the work of `on`.
     *
     * @method removeListener
     * @param type {string}         DOM event channel name e.g., "click", "touchmove"
     * @param handler {function}    Handler
     */
    ElementOutput.prototype.off = function off(type, handler) {
        EventHandler.prototype.off.apply(this._eventOutput, arguments);
    };

    /**
     * Emit an event with optional data payload. This will execute all listening
     *  to the channel name with the payload as only argument.
     *
     * @method emit
     * @param type {string}         Event channel name
     * @param [payload] {Object}    User defined data payload
     */
    ElementOutput.prototype.emit = function emit(type, payload) {
        EventHandler.prototype.emit.apply(this._eventOutput, arguments);
    };

    /**
     * Assigns the DOM element for committing and to and attaches event listeners.
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
     * Removes the associated DOM element in memory and detached event listeners.
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

    /**
     * Commits the layout and size information of the element to the DOM.
     *  Called once per Engine tick by the RootNode this element has been added to
     *  if some parent's SceneGraph node's data has changed.
     *
     * @method commit
     * @private
     * @param [layout] {Object} Layout data: transform, origin, opacity.
     */
    ElementOutput.prototype.commit = function commit(layout) {
        var target = this._currentTarget;
        if (!target || !layout) return;

        var cache = this._cachedSpec;

        var transform = layout.transform || Transform.identity;
        var opacity = (layout.opacity === undefined) ? 1 : layout.opacity;
        var origin = layout.origin || _zeroZero;

        this._transformDirty = Transform.notEquals(cache.transform, transform);
        this._opacityDirty = this._opacityDirty || (cache.opacity !== opacity);
        this._originDirty = this._originDirty || (origin && _xyNotEquals(cache.origin, origin));

        if (this._opacityDirty) {
            cache.opacity = opacity;
            _setOpacity.call(this, target, opacity);
        }

        if (this._originDirty){
            cache.origin = origin;
            _setOrigin(target, origin);
        }

        if (this._transformDirty) {
            cache.transform = transform;
            _setTransform(target, transform);
        }

        if (this._sizeDirty) {
            var size = cache.size;
            _setSize(target, size);
        }

        this._originDirty = false;
        this._transformDirty = false;
        this._opacityDirty = false;
        this._sizeDirty = false;
    };

    module.exports = ElementOutput;
});
