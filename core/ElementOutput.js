/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Entity = require('./Entity');
    var EventHandler = require('./EventHandler');
    var Transform = require('./Transform');

    var usePrefix = !('transform' in document.documentElement.style);
    var devicePixelRatio = window.devicePixelRatio || 1;
    var invDevicePixelRatio = 1 / devicePixelRatio;

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
        this._origin = null;
        this._size = null;

        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);

        this.eventForwarder = function eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);

//        this._id = Entity.register(this);
        this._currentTarget = null;

        this._opacityDirty = true;
        this._sizeDirty = true;
        this._originDirty = true;
        this._transformDirty = true;

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
        if (this._currentTarget) this._currentTarget.addEventListener(type, this.eventForwarder);
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
        if (event && !event.origin) event.origin = this;
        var handled = this._eventOutput.emit(type, event);
        if (handled && event && event.stopPropagation) event.stopPropagation();
        return handled;
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    ElementOutput.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    ElementOutput.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    /**
     * Return spec for this surface. Note that for a base surface, this is
     *    simply an id.
     *
     * @method render
     * @private
     * @return {Object} render spec for this surface (spec id)
     */
    ElementOutput.prototype.render = function render() {
        return undefined;
    };

    //  Attach Famous event handling to document events emanating from target
    //    document element.  This occurs just after attachment to the document.
    //    Calling this enables methods like #on and #pipe.
    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners) {
            target.addEventListener(i, this.eventForwarder);
        }
    }

    //  Detach Famous event handling from document events emanating from target
    //  document element.  This occurs just before detach from the document.
    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners) {
            target.removeEventListener(i, this.eventForwarder);
        }
    }

    /**
     * Return a Matrix's webkit css representation to be used with the
     *    CSS3 -webkit-transform style.
     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
     *
     * @method _formatCSSTransform
     * @private
     * @param {Transform} matrix transform
     * @return {string} matrix3d CSS style representation of the transform
     */
    function _formatCSSTransform(matrix) {
        matrix[12] = Math.round(matrix[12] * devicePixelRatio) * invDevicePixelRatio;
        matrix[13] = Math.round(matrix[13] * devicePixelRatio) * invDevicePixelRatio;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) result += matrix[i] + ',';

        return result + matrix[15] + ')';
    }

    /**
     * Directly apply given Transform to the document element as the
     *   appropriate webkit CSS style.
     *
     * @method setTransform
     *
     * @static
     * @private
     * @param {Element} element document element
     * @param {FamousMatrix} matrix
     */

    var _setTransform;
    if (usePrefix) {
        _setTransform = function(element, matrix) {
            element.style.webkitTransform = _formatCSSTransform(matrix);
        };
    }
    else {
        _setTransform = function(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };
    }

    // format origin as CSS percentage string
    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    // Directly apply given origin coordinates to the document element as the
    // appropriate webkit CSS style.
    var _setOrigin = usePrefix ? function(element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function(element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };

    // Shrink given document element until it is effectively invisible.
    var _setInvisible = usePrefix ? function(element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    } : function(element) {
        element.style.transform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    };

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

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

        var transform = spec.transform;
        var opacity = spec.opacity;
        var origin = spec.origin;
        var size = spec.size;

        // this will be false for a true-sized element after the first pass
        // even though this._size != spec.size
        var dirtyTrueSize = this._trueSizeCheck && this.size && (this.size[0] == true || this.size[1] == true);

        if (_xyNotEquals(this._size, size) || dirtyTrueSize)
            this._sizeDirty = true;

        this._originDirty = _xyNotEquals(this._origin, origin);
        this._transformDirty = Transform.notEquals(this._transform, transform);
        this._opacityDirty = (this._opacity !== opacity);

        if (this._opacityDirty) {
            this._opacity = opacity;
            target.style.opacity = (opacity >= 1) ? '0.999999' : opacity;
            this._opacityDirty = false;
        }

        // size nullity check needed for Group and other renderables with no defined size
        if (this.size && this._sizeDirty) {
            if (!this._size) this._size = [0,0];

            // take on numeric size values if available
            if (typeof this.size[0] === 'number') this._size[0] = this.size[0];
            if (typeof this.size[1] === 'number') this._size[1] = this.size[1];

            // take on parent size if size is undefined
            if (this.size[0] === undefined) this._size[0] = spec.size[0];
            if (this.size[1] === undefined) this._size[1] = spec.size[1];

            // flag to ping the DOM for the current element size
            if (this._trueSizeCheck) {
                if (this.size[0] === true) this._size[0] = target.offsetWidth;
                if (this.size[1] === true) this._size[1] = target.offsetHeight;
                this._trueSizeCheck = false;
            }

            // commit pixel size unless dimension's size is true
            if (this.size[0] !== true) target.style.width = this._size[0] + 'px';
            if (this.size[1] !== true) target.style.height = this._size[1] + 'px';

            this._eventOutput.emit('resize');
        }

        if (this._originDirty) {
            if (origin) {
                if (!this._origin) this._origin = [0, 0];
                this._origin[0] = origin[0];
                this._origin[1] = origin[1];
            }
            else this._origin = null;
            _setOrigin(target, this._origin);
        }

        if (this._transformDirty || this._originDirty || (this.size && this._sizeDirty && origin)) {
            this._transform = transform || Transform.identity;

            if (origin && !(origin[0] === 0 && origin[1] === 0))
                _setTransform(target, Transform.thenMove(transform, [-this._size[0]*origin[0], -this._size[1]*origin[1], 0]));
            else
                _setTransform(target, transform);

            this._originDirty = false;
            this._transformDirty = false;
            this._sizeDirty = false;
        }
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
